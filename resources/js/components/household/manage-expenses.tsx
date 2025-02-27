import { Expense } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ManageExpenses = ({ expenses }: { expenses: Expense[] }) => {
    const {
        data: expenseData,
        setData: setExpenseData,
        post: postExpense,
        processing: expenseProcessing,
    } = useForm({
        name: '',
        amount: '',
    });
    const { delete: deleteExpense, processing: deleteProcessing } = useForm();
    const handleAddExpense = () => {
        postExpense(route('expense.create'), {
            onSuccess: () => {
                setExpenseData({ name: '', amount: '' });
            },
        });
    };
    const handleDeleteExpense = (expenseId: number) => {
        deleteExpense(route('expense.delete', { id: expenseId }), {
            onSuccess: () => {
                router.reload();
            },
        });
    };
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold">Manage Expenses</h2>

            {/* Expenses List */}
            <div className="mt-8">
                <h3 className="text-lg font-medium">Current Expenses</h3>
                <ul className="mt-2 space-y-2">
                    {expenses.map((expense: Expense) => (
                        <li key={expense.id} className="flex items-center justify-between">
                            <span>
                                {expense.name}: ${expense.amount}
                            </span>
                            <Button onClick={() => handleDeleteExpense(expense.id)} variant="destructive" isLoading={deleteProcessing}>
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 space-y-4">
                <label className="font-medium">Expense Name</label>
                <Input type="text" value={expenseData.name} onChange={(e) => setExpenseData('name', e.target.value)} placeholder="Expense Name" />

                <label className="font-medium">Amount</label>
                <Input type="number" value={expenseData.amount} onChange={(e) => setExpenseData('amount', e.target.value)} placeholder="Amount" />

                <Button onClick={handleAddExpense} isLoading={expenseProcessing} className="w-full">
                    {expenseProcessing ? 'Adding Expense...' : 'Add Expense'}
                </Button>
            </div>
        </div>
    );
};

export default ManageExpenses;
