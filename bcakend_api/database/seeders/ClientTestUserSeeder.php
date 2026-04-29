<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientTestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'testclient@example.com'],
            [
                'full_name' => 'Test Client',
                'username' => 'testclient',
                'password' => Hash::make('Password@123'),
                'role' => 'client',
                'agreed_to_terms' => true,
                'email_verified_at' => now(),
            ]
        );

        echo "Test client user created: testclient@example.com / Password@123\n";
    }
}
