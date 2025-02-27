<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date|before_or_equal:today',
        ]);

        Expense::create([
            'name' => $request->name,
            'amount' => $request->amount,
            'date' => $request->date,
            'household_id' => Auth::user()->household_id,
        ]);

        return back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date|before_or_equal:today',
        ]);

        $expense = Expense::findOrFail($id);

        if (Auth::user()->household_id !== $expense->household_id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $expense->update([
            'name' => $request->name,
            'amount' => $request->amount,
            'date' => $request->date,
        ]);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }


    public function destroy(Expense $expense)
    {
        $expense->delete();
        return back();
    }
}
