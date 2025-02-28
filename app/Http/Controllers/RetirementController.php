<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\User;

class RetirementController extends Controller
{
    public function get()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $retirement = $user->retirement()->first();

        if (!$retirement) {
            $retirement = $user->retirement()->create([]);
        }

        $household = $user->household()->with('expenses')->first();

        if (!$household) {
            return Inertia::render('household', [
                'household' => null,
                'membersWithSalaries' => [],
            ]);
        }

        $membersWithSalaries = User::where('household_id', $household->id)
            ->select('id', 'name', 'salary')
            ->get();

        $totalSalary = $membersWithSalaries->sum('salary');
        $totalExpenses = $household->expenses->sum('amount');

        $fundsLeftToInvest = null;
        foreach ($membersWithSalaries as $member) {
            $contribution = ($member->salary / $totalSalary) * $totalExpenses;
            if ($member->id === $user->id) {
                $fundsLeftToInvest = $member->salary - $contribution;
                break;
            }
        }

        return Inertia::render('retirement', [
            'retirement' => $retirement,
            'fundsLeftToInvest' => round($fundsLeftToInvest, 0),
        ]);
    }


    // FEATURE REMOVED DUE TO FREE API KEY LIMITS
    // // // // // // // // // // // // // // // // 
    // public function searchEtfs(Request $request)
    // {
    //     $query = $request->input('query');
    //     if (!$query) {
    //         return response()->json([
    //             'etfs' => [],
    //         ]);
    //     }
    //
    //     $apiKey = config('services.alphavantage.key');
    //
    //     $response = Http::get('https://www.alphavantage.co/query', [
    //         'function' => 'SYMBOL_SEARCH',
    //         'keywords' => $query,
    //         'apikey' => $apiKey,
    //     ]);
    //
    //     $etfs = [];
    //     if ($response->successful()) {
    //         $results = $response->json();
    //         $bestMatches = $results['bestMatches'] ?? [];
    //         foreach ($bestMatches as $match) {
    //             if (isset($match['type']) && $match['type'] === 'ETF') {
    //                 $etfs[] = $match;
    //             }
    //         }
    //     }
    //     return response()->json([
    //         'etfs' => $etfs,
    //     ]);
    // }
    // // // // // // // // // // // // // // // // 
}
