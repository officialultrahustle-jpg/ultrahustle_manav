<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MeController extends Controller
{
    public function destroy(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        DB::transaction(function () use ($user): void {

            // Revoke tokens (correct)
            $user->tokens()->delete();

            if ($user->personalInfo) {
                $user->personalInfo()->delete();
            }

            // ✅ Soft delete user
            $user->delete();
        });

        return response()->json([
            'status' => true,
            'message' => 'Account scheduled for deletion after 90 days.',
            'data' => [
                'uh_user_id' => $user->uh_user_id,
            ],
        ]);
    }
}
