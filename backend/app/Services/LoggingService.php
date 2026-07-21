<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\AuditTrail;
use Illuminate\Database\Eloquent\Model;

class LoggingService
{
    public function log(
        string $action,
        ?string $description = null,
        ?Model $model = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?int $cooperativeId = null,
    ): void {
        $data = [
            'user_id' => auth()->id(),
            'action' => $action,
            'description' => $description,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ];

        if ($cooperativeId || ($model && in_array('cooperative_id', $model->getFillable() ?? []))) {
            $data['cooperative_id'] = $cooperativeId ?? $model?->cooperative_id;
        }

        ActivityLog::create($data);
    }

    public function audit(
        string $action,
        string $description,
        ?Model $model = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        AuditTrail::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'description' => $description,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
