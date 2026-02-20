<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Task $task
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $dueDate = $this->task->due_date->format('d/m/Y H:i');
        $priorityLabels = [
            'low' => 'Baixa',
            'medium' => 'Média',
            'high' => 'Alta',
            'urgent' => 'Urgente',
        ];
        $priority = $priorityLabels[$this->task->priority] ?? 'Média';

        return (new MailMessage)
            ->subject("⚡ Lembrete: {$this->task->title} - Leovox Task")
            ->greeting("Olá, {$notifiable->name}!")
            ->line("Sua tarefa está próxima do vencimento:")
            ->line("**Tarefa:** {$this->task->title}")
            ->line("**Vencimento:** {$dueDate}")
            ->line("**Prioridade:** {$priority}")
            ->line("**Categoria:** {$this->task->category}")
            ->when($this->task->description, function ($message) {
                return $message->line("**Descrição:** {$this->task->description}");
            })
            ->action('Ver Tarefa', env('FRONTEND_URL', 'http://localhost:3000'))
            ->line('Não deixe para depois! Mantenha sua produtividade em dia.')
            ->salutation('— Equipe Leovox Task');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'title' => $this->task->title,
            'due_date' => $this->task->due_date,
        ];
    }
}
