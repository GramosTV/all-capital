<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
        ]);

        Expense::create([
            'name' => $request->name,
            'amount' => $request->amount,
            'household_id' => Auth::user()->household_id,
        ]);

        return back()->with('success', 'Expense created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $expense = Expense::findOrFail($id);

        if (Auth::user()->household_id !== $expense->household_id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $expense->update([
            'name' => $request->name,
            'amount' => $request->amount,
        ]);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }


    public function delete(Request $request)
    {
        $expense = Expense::findOrFail($request->id);

        if (Auth::user()->household_id !== $expense->household_id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $expense->delete();
        return back()->with('success', 'Expense deleted successfully.');
    }
}
