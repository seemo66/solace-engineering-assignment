import type { Advocate } from '@/types/advocate';

type AdvocateCardProps = {
  advocate: Advocate;
};

export default function AdvocateCard({ advocate }: AdvocateCardProps) {
  return (
    // a container for the advocate's information
    <div
      data-testid="advocate-card"
      className="border rounded-lg p-4 shadow hover:shadow-md transition"
    >
      {/* advocate's name */}
      <h2 className="text-xl font-semibold">
        {advocate.firstName} {advocate.lastName}
      </h2>

      {/* city and degree */}
      <p className="text-gray-600">
        {advocate.city} | {advocate.degree}
      </p>

      {/* specialties section */}
      <p className="mt-2 font-medium">specialties:</p>
      {/* a list of the advocate's specialties */}
      <ul className="list-disc list-inside text-sm text-gray-700 max-h-24 overflow-auto">
        {advocate.specialties.map((specialty) => (
          <li key={specialty}>{specialty}</li>
        ))}
      </ul>

      {/* years of experience */}
      <p className="mt-2">years of experience: {advocate.yearsOfExperience}</p>

      {/* phone number */}
      <p>phone: {advocate.phoneNumber}</p>
    </div>
  );
}
