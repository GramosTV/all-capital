import CircleChart from '@/components/circle-chart';
import ManageInstruments from '@/components/retirement/manage-instrument';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Instrument, Retirement } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retirement',
        href: '/retirement',
    },
];
interface RetirementProps {
    retirement: Retirement | null;
    instruments: Instrument[];
    fundsLeftToInvest: number;
}

export default function RetirementPage({ retirement, fundsLeftToInvest, instruments }: RetirementProps) {
    console.log(retirement);
    console.log(instruments);
    // Calculate the total weight of the instruments
    const totalWeight = instruments.reduce((acc, instrument) => acc + instrument.weight, 0);
    console.log('totalWeight', totalWeight);
    // Calculate the weight of free cash
    const freeCashWeight = 100 - totalWeight;

    // Prepare the data for the CircleChart
    const chartData = [
        {
            name: 'Free Cash',
            amount: (freeCashWeight / 100) * fundsLeftToInvest,
        },
        ...instruments.map((instrument) => ({
            name: instrument.name,
            amount: (instrument.weight / 100) * fundsLeftToInvest,
        })),
    ].sort((a, b) => b.amount - a.amount);

    const totalROI =
        instruments.reduce((acc, instrument) => {
            const roi = instrument.weight * instrument.yearly_return;
            return acc + roi;
        }, 0) / 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Retirement" />
            {retirement ? (
                <div className="mt-4 max-w-2xl md:px-8">
                    <h1 className="mb-2 text-3xl font-bold">Retirement Plan</h1>
                    <h1>Welcome to your Retirement!</h1>
                    <div className="mt-8">
                        <CircleChart title="Retirement" data={chartData} />
                        <h2>ROI: {totalROI}%</h2>
                    </div>
                    <ManageInstruments instruments={instruments} />
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
