<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InstrumentController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'yearly_return' => 'required|numeric',
            'weight' => 'required|numeric|min:0|max:100',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $retirement = $user->retirement()->first();

        if (!$retirement) {
            return response()->json(['message' => 'Retirement not found'], 404);
        }

        $retirement->instruments()->create([
            'name' => $request->input('name'),
            'yearly_return' => $request->input('yearly_return'),
            'weight' => $request->input('weight'),
        ]);

        return to_route('retirement.get');
    }

    public function delete($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $retirement = $user->retirement()->first();

        if (!$retirement) {
            return response()->json(['message' => 'Retirement not found'], 404);
        }

        $instrument = $retirement->instruments()->find($id);

        if (!$instrument) {
            return response()->json(['message' => 'Instrument not found'], 404);
        }

        $instrument->delete();

        return  back()->with(['message', 'Instrument deleted successfully']);
    }
}
