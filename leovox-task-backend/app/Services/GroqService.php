<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key');
        $this->model = config('services.groq.model', 'llama-3.3-70b-versatile');
    }

    /**
     * Parse natural language input into structured task data.
     */
    public function parseTaskFromNaturalLanguage(string $userInput): array
    {
        $systemPrompt = <<<PROMPT
Você é um assistente de produtividade da Leovox Task. Sua função é extrair informações estruturadas de tarefas a partir de texto em linguagem natural.

Analise o texto do usuário e extraia os seguintes campos em formato JSON:
- title (string, obrigatório): O título principal e conciso da tarefa.
- description (string, opcional): Uma descrição mais detalhada da tarefa.
- due_date (string, opcional): A data e hora de vencimento no formato "YYYY-MM-DD HH:mm:ss". Se apenas a data for mencionada, use 23:59:59 como hora. Se for mencionado "amanhã", "próxima segunda", etc., calcule a data correta considerando que hoje é a data atual.
- priority (string): A prioridade da tarefa. Valores possíveis: "low", "medium", "high", "urgent". Se não mencionada, use "medium".
- category (string, opcional): Uma categoria para agrupar a tarefa (ex: "Trabalho", "Pessoal", "Estudos", "Saúde", "Finanças"). Se não mencionada, use "General".
- tags (array de strings, opcional): Uma lista de tags ou palavras-chave relevantes.

Responda APENAS com o JSON válido, sem nenhum texto adicional, sem markdown, sem blocos de código.
PROMPT;

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($this->baseUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => $userInput,
                    ],
                ],
                'temperature' => 0.1,
                'max_tokens' => 1024,
                'response_format' => ['type' => 'json_object'],
            ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                $parsed = json_decode($content, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('Groq: Falha ao parsear JSON da resposta', ['content' => $content]);
                    return ['error' => 'Falha ao interpretar a resposta da IA.'];
                }

                return $this->validateAndNormalize($parsed);
            }

            Log::error('Groq API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return ['error' => 'Erro na comunicação com a IA. Tente novamente.'];
        } catch (\Exception $e) {
            Log::error('Groq service exception', ['message' => $e->getMessage()]);
            return ['error' => 'Erro ao processar com IA: ' . $e->getMessage()];
        }
    }

    /**
     * Validate and normalize the parsed task data.
     */
    private function validateAndNormalize(array $data): array
    {
        $normalized = [];

        // Title is required
        if (empty($data['title'])) {
            return ['error' => 'A IA não conseguiu extrair um título da tarefa.'];
        }

        $normalized['title'] = trim($data['title']);
        $normalized['description'] = isset($data['description']) ? trim($data['description']) : null;

        // Normalize due_date
        if (!empty($data['due_date'])) {
            try {
                $date = new \DateTime($data['due_date']);
                $normalized['due_date'] = $date->format('Y-m-d H:i:s');
            } catch (\Exception $e) {
                $normalized['due_date'] = null;
            }
        } else {
            $normalized['due_date'] = null;
        }

        // Normalize priority
        $validPriorities = ['low', 'medium', 'high', 'urgent'];
        $normalized['priority'] = in_array($data['priority'] ?? '', $validPriorities)
            ? $data['priority']
            : 'medium';

        // Normalize category
        $normalized['category'] = !empty($data['category']) ? trim($data['category']) : 'General';

        // Normalize tags
        $normalized['tags'] = isset($data['tags']) && is_array($data['tags'])
            ? array_values(array_filter(array_map('trim', $data['tags'])))
            : [];

        return $normalized;
    }
}
