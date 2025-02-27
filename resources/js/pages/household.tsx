import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Expense, Household as HouseholdType } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Household',
        href: '/household',
    },
];

interface HouseholdProps {
    household: HouseholdType | null;
}

export default function Household({ household }: HouseholdProps) {
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
    } = useForm({
        name: '',
    });

    const {
        data: joinData,
        setData: setJoinData,
        patch,
        processing: joinProcessing,
    } = useForm({
        household_code: '',
    });

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

    const handleCreateHousehold = () => {
        post(route('household.create'), {
            data: createData,
            onSuccess: () => {
                setCreateData({ name: '' });
            },
        });
    };

    const handleJoinHousehold = () => {
        patch(route('household.join'), {
            data: joinData,
            onSuccess: () => {
                setJoinData({ household_code: '' });
            },
        });
    };

    const handleAddExpense = () => {
        postExpense(route('expense.create'), {
            data: expenseData,
            onSuccess: () => {
                setExpenseData({ name: '', amount: '' });
            },
        });
    };
    const handleDeleteExpense = (expenseId: number) => {
        deleteExpense(route('expense.delete', { id: expenseId }), {
            onSuccess: () => {
                household.expenses = household.expenses.filter((expense) => expense.id !== expenseId);
                alert('Expense deleted successfully');
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Household" />
            {household ? (
                <div className="max-w-2xl md:px-4">
                    <h1>Welcome to your Household - {household.name}</h1>

                    {/* Manage Expenses Form */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Manage Expenses</h2>
                        <div className="mt-4 space-y-4">
                            <label className="font-medium">Expense Name</label>
                            <Input
                                type="text"
                                value={expenseData.name}
                                onChange={(e) => setExpenseData('name', e.target.value)}
                                placeholder="Expense Name"
                            />

                            <label className="font-medium">Amount</label>
                            <Input
                                type="number"
                                value={expenseData.amount}
                                onChange={(e) => setExpenseData('amount', e.target.value)}
                                placeholder="Amount"
                            />

                            <Button onClick={handleAddExpense} isLoading={expenseProcessing} className="w-full">
                                {expenseProcessing ? 'Adding Expense...' : 'Add Expense'}
                            </Button>
                        </div>

                        {/* Expenses List */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium">Current Expenses</h3>
                            <ul className="mt-2 space-y-2">
                                {household.expenses.map((expense: Expense) => (
                                    <li key={expense.id} className="flex items-center justify-between">
                                        <span>
                                            {expense.name}: ${expense.amount}
                                        </span>
                                        <Button onClick={() => handleDeleteExpense(expense.id)} variant="destructive">
                                            Delete
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="md:px-4">
                    <h1>You don't have a household</h1>
                    <p>You need to create or join a household.</p>

                    {/* Create Household Form */}
                    <div className="mt-4 space-y-4">
                        <label htmlFor="household_name" className="font-medium">
                            Enter Household Name
                        </label>
                        <Input
                            id="household_name"
                            type="text"
                            value={createData.name}
                            onChange={(e) => setCreateData('name', e.target.value)}
                            placeholder="Enter Household Name"
                        />
                        <Button onClick={handleCreateHousehold} isLoading={createProcessing} className="w-full">
                            {createProcessing ? 'Creating Household...' : 'Create Household'}
                        </Button>
                    </div>

                    {/* Join Household Form */}
                    <div className="mt-4 space-y-4">
                        <label htmlFor="household_code" className="font-medium">
                            Enter Household Code
                        </label>
                        <Input
                            id="household_code"
                            type="text"
                            value={joinData.household_code}
                            onChange={(e) => setJoinData('household_code', e.target.value)}
                            placeholder="Enter Household Code"
                        />
                        <Button onClick={handleJoinHousehold} isLoading={joinProcessing} className="w-full">
                            {joinProcessing ? 'Joining Household...' : 'Join Household'}
                        </Button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
