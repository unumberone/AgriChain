// frontend/src/components/dashboard/FarmRegistration.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useContract } from '../../hooks/useContract';
import { useIPFS } from '../../hooks/useIPFS';
import Button from '../common/Button';

export default function FarmRegistration() {
  const { register: formRegister, handleSubmit, reset } = useForm();
  const { registerFarm } = useContract();
  const { uploadToIPFS } = useIPFS();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const ipfsHash = await uploadToIPFS(JSON.stringify({
        description: data.description,
        images: data.images,
      }));

      await registerFarm(
        data.name,
        data.location,
        data.certifications.split(',').map(cert => cert.trim()),
        ipfsHash
      );

      reset();
    } catch (error) {
      console.error('Error registering farm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Register Your Farm</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Farm Name</label>
          <input
            type="text"
            {...formRegister('name', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            {...formRegister('location', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Certifications (comma-separated)</label>
          <input
            type="text"
            {...formRegister('certifications')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...formRegister('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <Button type="submit" loading={loading}>
          Register Farm
        </Button>
      </form>
    </div>
  );
}