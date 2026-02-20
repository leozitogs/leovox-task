<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\GroqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the user's tasks.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->tasks();

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['todo', 'in_progress', 'done'])) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority') && in_array($request->priority, ['low', 'medium', 'high', 'urgent'])) {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search by title or description
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSorts = ['created_at', 'updated_at', 'due_date', 'priority', 'title'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $tasks = $query->paginate($request->get('per_page', 20));

        return response()->json($tasks);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'status' => ['nullable', 'in:todo,in_progress,done'],
            'category' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        $task = $request->user()->tasks()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'priority' => $validated['priority'] ?? 'medium',
            'status' => $validated['status'] ?? 'todo',
            'category' => $validated['category'] ?? 'General',
            'tags' => $validated['tags'] ?? [],
        ]);

        return response()->json([
            'message' => 'Tarefa criada com sucesso.',
            'task' => $task,
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): JsonResponse
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        return response()->json($task);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'status' => ['nullable', 'in:todo,in_progress,done'],
            'category' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Tarefa atualizada com sucesso.',
            'task' => $task->fresh(),
        ]);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): JsonResponse
    {
        // Ensure the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Tarefa removida com sucesso.',
        ]);
    }

    /**
     * Update the status of a task.
     */
    public function updateStatus(Request $request, Task $task): JsonResponse
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:todo,in_progress,done'],
        ]);

        $task->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status atualizado com sucesso.',
            'task' => $task->fresh(),
        ]);
    }

    /**
     * Parse natural language input using Groq AI and create a task.
     */
    public function parseWithAI(Request $request): JsonResponse
    {
        $request->validate([
            'input' => ['required', 'string', 'max:1000'],
        ]);

        $groqService = new GroqService();
        $parsed = $groqService->parseTaskFromNaturalLanguage($request->input('input'));

        if (isset($parsed['error'])) {
            return response()->json([
                'message' => $parsed['error'],
            ], 422);
        }

        // Create the task with parsed data
        $task = $request->user()->tasks()->create([
            'title' => $parsed['title'],
            'description' => $parsed['description'],
            'due_date' => $parsed['due_date'],
            'priority' => $parsed['priority'],
            'category' => $parsed['category'],
            'tags' => $parsed['tags'],
            'status' => 'todo',
        ]);

        return response()->json([
            'message' => 'Tarefa criada com sucesso via IA.',
            'task' => $task,
            'parsed' => $parsed,
        ], 201);
    }

    /**
     * Get dashboard statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $tasks = Task::where('user_id', $userId);

        $total = (clone $tasks)->count();
        $todo = (clone $tasks)->where('status', 'todo')->count();
        $inProgress = (clone $tasks)->where('status', 'in_progress')->count();
        $done = (clone $tasks)->where('status', 'done')->count();
        $urgent = (clone $tasks)->where('priority', 'urgent')->where('status', '!=', 'done')->count();
        $overdue = (clone $tasks)->where('due_date', '<', now())
            ->where('status', '!=', 'done')
            ->count();

        // Tasks due today
        $dueToday = (clone $tasks)->whereDate('due_date', today())
            ->where('status', '!=', 'done')
            ->count();

        // Categories breakdown
        $categories = Task::where('user_id', $userId)
            ->where('status', '!=', 'done')
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        return response()->json([
            'total' => $total,
            'todo' => $todo,
            'in_progress' => $inProgress,
            'done' => $done,
            'urgent' => $urgent,
            'overdue' => $overdue,
            'due_today' => $dueToday,
            'categories' => $categories,
        ]);
    }
}
