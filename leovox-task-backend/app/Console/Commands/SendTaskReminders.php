<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Notifications\TaskReminderNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendTaskReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envia lembretes para tarefas com vencimento nas próximas 24 horas';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $now = Carbon::now();
        $next24Hours = $now->copy()->addHours(24);

        $tasks = Task::with('user')
            ->where('status', '!=', 'done')
            ->where('reminder_sent', false)
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [$now, $next24Hours])
            ->get();

        $count = 0;

        foreach ($tasks as $task) {
            try {
                $task->user->notify(new TaskReminderNotification($task));
                $task->update(['reminder_sent' => true]);
                $count++;
            } catch (\Exception $e) {
                $this->error("Erro ao enviar lembrete para tarefa #{$task->id}: {$e->getMessage()}");
            }
        }

        $this->info("Lembretes enviados: {$count}");

        return Command::SUCCESS;
    }
}
