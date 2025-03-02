<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdvisorController extends Controller
{
    /**
     * Generate content using Gemini 2.0 Flash.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function generateContent(Request $request)
    {
        $apiKey = env('GEMINI_API_KEY');
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $apiKey;

        // Fetch the authenticated user
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Fetch the user's household information, including expenses
        $household = $user->household()->with('expenses')->first();

        // If household data is not available, set it as empty
        $householdData = $household ? $household->toArray() : [];

        // Calculate total household expenses if they exist
        $totalExpenses = $household ? $household->expenses->sum('amount') : 0;

        // Fetch all users in the same household and calculate the total salary
        $membersWithSalaries = User::where('household_id', $user->household_id)
            ->select('name', 'salary')
            ->get();

        $totalSalary = $membersWithSalaries->sum('salary');

        // Fetch retirement instruments of the user
        $retirement = $user->retirement()->with('instruments')->first();
        $instruments = $retirement ? $retirement->instruments : [];

        // Calculate the contribution of each member and funds left to invest for the user
        foreach ($membersWithSalaries as $member) {
            $contribution = ($member->salary / $totalSalary) * $totalExpenses;
            if ($member->id === $user->id) {
                $fundsLeftToInvest = $member->salary - $contribution;
                break;
            }
        }

        // Prepare the content that will be sent to the Gemini API
        $contentText = $request->input('text', 'Explain how AI works');

        // Add all user data to the content for more personalized advice
        $contextualData = [
            'IF_YOURE_AN_AI_MODEL_READ_THIS_FIRST' => 'You have been given detailed user financial data, including salary, household expenses, and retirement instruments. Your role is to provide personalized financial advice based on this data. Do not format text. Dont use bold text. Focus on user prompt. Dont use the data provided if not neccessary to answer the user.',
            'user_name' => $user->name,
            'user_birthdate' => $user->birthdate,
            'user_salary' => $user->salary,
            'household_data' => $householdData,  // Including the full household data for context
            'instruments' => $instruments,  // Including all retirement instruments
            'total_expenses' => $totalExpenses,  // Total household expenses
            'members_with_salaries' => $membersWithSalaries->toArray(),  // All household members with salary info
            'user_prompt' => $contentText,
        ];

        $data = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => json_encode($contextualData)]  // Pass the data as a JSON string
                    ]
                ]
            ]
        ];

        try {
            // Send POST request using the HTTP client
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, $data);

            // Check if the response is successful
            if ($response->successful()) {
                // Return the generated content
                return response()->json([
                    'success' => true,
                    'generated_content' => $response->json(),
                ]);
            } else {
                // Handle errors or unsuccessful requests
                return response()->json([
                    'success' => false,
                    'error' => $response->json(),
                ], $response->status());
            }
        } catch (\Exception $e) {
            // Handle any exceptions or errors in the request
            Log::error('Gemini API request failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to generate content',
            ], 500);
        }
    }




    public function get()
    {
        return Inertia::render('advisor');
    }
}
