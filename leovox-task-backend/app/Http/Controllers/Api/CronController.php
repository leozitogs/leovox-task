<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Notifications\TaskReminderNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CronController extends Controller
{
    /**
     * Send reminders for tasks due in the next 24 hours.
     * This endpoint can be called by Vercel Cron Jobs or any external scheduler.
     */
    public function sendReminders(Request $request): JsonResponse
    {
        // Verify cron secret for security
        $cronSecret = $request->header('X-Cron-Secret');
        if ($cronSecret !== config('app.cron_secret')) {
            return response()->json(['message' => 'Não autorizado.'], 401);
        }

        $now = Carbon::now();
        $next24Hours = $now->copy()->addHours(24);

        $tasks = Task::with('user')
            ->where('status', '!=', 'done')
            ->where('reminder_sent', false)
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [$now, $next24Hours])
            ->get();

        $sent = 0;
        $errors = 0;

        foreach ($tasks as $task) {
            try {
                $task->user->notify(new TaskReminderNotification($task));
                $task->update(['reminder_sent' => true]);
                $sent++;
            } catch (\Exception $e) {
                $errors++;
            }
        }

        return response()->json([
            'message' => 'Processamento de lembretes concluído.',
            'sent' => $sent,
            'errors' => $errors,
            'total_found' => $tasks->count(),
        ]);
    }
}
