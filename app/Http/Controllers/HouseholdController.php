<?php

namespace App\Http\Controllers;

use App\Models\Household;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\User;

class HouseholdController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $code = Str::random(8);

        $household = Household::create([
            'name' => $request->name,
            'code' => $code,
        ]);

        $user = Auth::user();
        /** @var \App\Models\User $user */
        $user->household_id = $household->id;
        $user->save();

        return to_route('household.create');
    }

    public function join(Request $request)
    {
        $request->validate([
            'household_code' => 'required|string|exists:households,code',
        ]);

        $user = Auth::user();
        /** @var \App\Models\User $user */
        $household = Household::where('code', $request->household_code)->first();

        if (!$household) {
            return back()->withErrors(['household_code' => 'Invalid household code.']);
        }

        $user->household_id = $household->id;
        $user->save();

        return to_route('household');
    }

    // The new "get" method for the household route:
    public function get()
    {
        // Get the authenticated user
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $household = $user->household()->with('expenses')->first();

        if (!$household) {
            return Inertia::render('household', [
                'household' => null,
                'membersWithSalaries' => [],
            ]);
        }

        $membersWithSalaries = User::where('household_id', $household->id)
            ->select('name', 'salary')
            ->get();

        return Inertia::render('household', [
            'household' => $household,
            'members' => $membersWithSalaries,
        ]);
    }
}
