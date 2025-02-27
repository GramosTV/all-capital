import CircleChart from '@/components/household/circle-chart';
import ManageExpenses from '@/components/household/manage-expenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Household as HouseholdType, Member } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Household',
        href: '/household',
    },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
interface HouseholdProps {
    household: HouseholdType | null;
    members: Member[];
}

export default function Household({ household, members }: HouseholdProps) {
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

    const handleCreateHousehold = () => {
        post(route('household.create'), {
            onSuccess: () => {
                setCreateData({ name: '' });
            },
        });
    };

    const handleJoinHousehold = () => {
        patch(route('household.join'), {
            onSuccess: () => {
                setJoinData({ household_code: '' });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Household" />
            {household ? (
                <div className="mt-4 max-w-2xl md:px-8">
                    <h1 className="mb-2 text-3xl font-bold">{household.name}</h1>
                    <h1>Welcome to your Household!</h1>
                    <h2>Want new members? Share your invite code - {household.code}</h2>
                    <div className="mt-8 flex items-center justify-around">
                        <CircleChart title={'Expenses Breakdown'} data={household.expenses} />
                        <CircleChart title={'Suggested Contributions'} data={members.map((member) => ({ ...member, amount: member.salary }))} />
                    </div>

                    <ManageExpenses expenses={household.expenses} />
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
