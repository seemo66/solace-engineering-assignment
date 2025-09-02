import type { Advocate } from '@/types/advocate';

type AdvocateCardProps = {
  advocate: Advocate;
};

export default function AdvocateCard({ advocate }: AdvocateCardProps) {
  return (
    <div
      data-testid="advocate-card"
      className="border rounded-lg p-4 shadow hover:shadow-md transition"
    >
      <h2 className="text-xl font-semibold">
        {advocate.firstName} {advocate.lastName}
      </h2>
      <p className="text-gray-600">
        {advocate.city} | {advocate.degree}
      </p>
      <p className="mt-2 font-medium">Specialties:</p>
      <ul className="list-disc list-inside text-sm text-gray-700 max-h-24 overflow-auto">
        {advocate.specialties.map((specialty) => (
          <li key={specialty}>{specialty}</li>
        ))}
      </ul>
      <p className="mt-2">Years of Experience: {advocate.yearsOfExperience}</p>
      <p>Phone: {advocate.phoneNumber}</p>
    </div>
  );
}
