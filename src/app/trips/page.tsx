import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TripsDisplay from "@/components/TripsDisplay";
import { Plane } from "lucide-react";

async function AllTrips() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be authorized to get the data.");
  }

  let allTrips = await prisma.trip.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  let allTripsIds = allTrips.map((tour: { id: string }) => tour.id);

  try {
    let allToursData = [];

    for (let i = 0; i < allTripsIds.length; i++) {
      let fetchedTrip = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/getAllTrips/?tripId=${allTripsIds[i]}`,
        { method: "GET" }
      );
      const tripData = await fetchedTrip.json();
      allToursData.push(tripData);
    }

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-purple-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Plane className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Your Trips</h1>
              </div>
              <p className="text-lg text-purple-100 max-w-2xl">
                Explore all your planned adventures. Click on any trip to view its detailed itinerary and make changes.
              </p>
            </div>
          </div>

          {/* Trips Grid */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <TripsDisplay trips={allToursData} />
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (e: any) {
    console.error(e.message);
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default AllTrips;
