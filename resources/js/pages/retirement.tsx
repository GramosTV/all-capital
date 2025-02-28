import CircleChart from '@/components/circle-chart';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Retirement } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retirement',
        href: '/retirement',
    },
];
interface RetirementProps {
    retirement: Retirement | null;
    fundsLeftToInvest: number;
}

export default function RetirementPage({ retirement, fundsLeftToInvest }: RetirementProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Retirement" />
            {retirement ? (
                <div className="mt-4 max-w-2xl md:px-8">
                    <h1 className="mb-2 text-3xl font-bold">Retirement Plan</h1>
                    <h1>Welcome to your Retirement!</h1>
                    <div className="mt-8">
                        <CircleChart title="Retirement" data={[{ name: 'Cash', amount: fundsLeftToInvest }]} />
                    </div>
                </div>
            ) : (
                <div className="md:px-4">
                    <h1>You don't have a Retirement</h1>
                    <p>You need to create or join a Retirement.</p>
                </div>
            )}
        </AppLayout>
    );
}
