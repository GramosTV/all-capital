import { Instrument } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const ManageInstruments = ({ instruments }: { instruments: Instrument[] }) => {
    // Using Inertia Form for handling form state and validation
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
    } = useForm({
        name: '',
        yearly_return: '',
        weight: '',
    });

    const { delete: deleteInstrument, processing: deleteProcessing } = useForm();

    const handleSubmit = () => {
        post(route('instruments.create'), {
            onSuccess: () => {
                setCreateData({ name: '', yearly_return: '', weight: '' });
            },
        });
    };

    const handleDeleteInstrument = (instrumentId: number) => {
        deleteInstrument(route('instruments.delete', { id: instrumentId }), {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    return (
        <div className="mt-8 max-w-2xl md:px-8">
            <h1 className="mb-4 text-3xl font-bold">Manage Instruments</h1>

            {/* Current Instruments List */}
            <div className="mt-8">
                <h3 className="text-lg font-medium">Current Instruments</h3>
                <ul className="mt-2 space-y-2">
                    {instruments.map((instrument: Instrument) => (
                        <li key={instrument.id} className="flex items-center justify-between">
                            <span>
                                {instrument.name}: {instrument.yearly_return}% ROI , {instrument.weight}% weight
                            </span>
                            <Button onClick={() => handleDeleteInstrument(instrument.id)} variant="destructive" isLoading={deleteProcessing}>
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instrument Creation Form */}
            <div className="mt-8 space-y-4">
                <h2 className="text-lg font-medium">Add New Instrument</h2>

                <div>
                    <Label htmlFor="name">Instrument Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={createData.name}
                        onChange={(e) => setCreateData('name', e.target.value)}
                        placeholder="Enter Instrument Name"
                    />
                </div>

                <div>
                    <Label htmlFor="yearly_return">Yearly Return (%)</Label>
                    <Input
                        id="yearly_return"
                        type="number"
                        value={createData.yearly_return}
                        onChange={(e) => setCreateData('yearly_return', e.target.value)}
                        placeholder="Enter Yearly Return"
                    />
                </div>

                <div>
                    <Label htmlFor="weight">Weight (%)</Label>
                    <Input
                        id="weight"
                        type="number"
                        value={createData.weight}
                        onChange={(e) => setCreateData('weight', e.target.value)}
                        placeholder="Enter Weight"
                    />
                </div>

                <Button onClick={handleSubmit} isLoading={createProcessing} className="w-full">
                    {createProcessing ? 'Adding Instrument...' : 'Add Instrument'}
                </Button>
            </div>
        </div>
    );
};

export default ManageInstruments;
