"use client";

import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import { FaPhone } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

import { Doctor } from "../../../types/doctor";
import { fetchAllDoctors } from "@/app/controller/doctorController";
import BookingModal from "@/components/BookingModal";

const BookingPage: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    experience: 0,
    minFee: 0,
    maxFee: 1000,
    availability: "All",
    consultType: "All",
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapDoctor = (doctor: any): Doctor => {
    let availability = "Morning";
    if (doctor.schedule) {
      if (doctor.schedule.includes("9 AM")) {
        availability = "Morning";
      } else if (doctor.schedule.includes("PM")) {
        availability = "Afternoon";
      }
    }

    return {
      _id: doctor._id,
      user_Id: doctor.user_Id,
      certification: doctor.certification,
      schedule: doctor.schedule,
      description: doctor.description,
      __v: doctor.__v,
      name: doctor.name || `Dr. ${doctor.user_Id}`,
      yearsOfExperience: doctor.yearsOfExperience || 10,
      availability: doctor.availability || availability,
      specialties: doctor.specialties || ["General Practice"],
      rating: doctor.rating || 4.0,
      reviews: doctor.reviews || 0,
      contactNumber: doctor.contactNumber || "+1-555-000-0000",
    };
  };

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiDoctors = await fetchAllDoctors();

        const mappedDoctors: Doctor[] = apiDoctors.map(mapDoctor);

        setDoctors(mappedDoctors);
        setFilteredDoctors(mappedDoctors);
      } catch (err: any) {
        setError(err.message || "Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doctor) => {
      const matchesExperience = doctor.yearsOfExperience >= filters.experience;
      const matchesAvailability =
        filters.availability === "All" ||
        doctor.availability === filters.availability;
      const matchesConsultType = filters.consultType === "All";

      return matchesExperience && matchesAvailability && matchesConsultType;
    });
    setFilteredDoctors(filtered);
  }, [filters, doctors]);

  const handleFilterChange = (
    key: string,
    value: string | number | { min: number; max: number }
  ) => {
    if (key === "fees") {
      const { min, max } = value as { min: number; max: number };
      setTempFilters((prev) => ({ ...prev, minFee: min, maxFee: max }));
    } else {
      setTempFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleBookAppointment = (doctor: Doctor) => {
    if (!session) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to book an appointment',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/sign-in');
        }
      });
      return;
    }

    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleModalConfirm = (selectedSlot: { date: string; time: string }) => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center py-10">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="relative pt-32 pb-10 p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mt-6">
        <div>
          <h2 className="text-2xl font-extrabold italic text-black tracking-tight">
            {filteredDoctors.length} Doctors Available
          </h2>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="bg-black text-white px-4 py-2 rounded-md text-lg cursor-pointer"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Sidebar Filter */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-6 
        w-1/4 transition-transform duration-700 ease-in-out z-50 ${
          isFilterVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontSize: "1.2rem" }}
      >
        <button
          onClick={() => setIsFilterVisible(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-lg cursor-pointer"
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Experience Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience
          </label>
          <Select
            value={tempFilters.experience.toString()}
            onValueChange={(value) =>
              handleFilterChange("experience", Number(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 5, 10, 15].map((exp) => (
                <SelectItem key={exp} value={exp.toString()}>
                  {exp}+ Years
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visiting Fees Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visiting Fees
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="200"
              value={tempFilters.minFee}
              onChange={(e) =>
                handleFilterChange("fees", {
                  min: Number(e.target.value),
                  max: tempFilters.maxFee,
                })
              }
              className="w-full"
            />
            <span>
              ${tempFilters.minFee} - ${tempFilters.maxFee}
            </span>
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <Select
            value={tempFilters.availability}
            onValueChange={(value) => handleFilterChange("availability", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Morning", "Afternoon", "Evening"].map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Consult Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consult Type
          </label>
          <div className="space-y-2">
            {["All", "On-site", "Home Visit"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="consultType"
                  value={type}
                  checked={tempFilters.consultType === type}
                  onChange={(e) =>
                    handleFilterChange("consultType", e.target.value)
                  }
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Apply Filter Button */}
        <button
          onClick={() => {
            setFilters(tempFilters);
            setIsFilterVisible(false);
          }}
          className="w-full bg-black text-white py-2 rounded-md text-lg mt-4"
        >
          Apply Filter
        </button>
      </div>

      {/* Doctors List Section */}
      <div className="w-full md:w-3/4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="relative overflow-hidden rounded-xl shadow-lg group w-full h-[450px] bg-white"
            >
              {/* Doctor Image */}
              <div className="relative h-72 w-full transition-transform duration-400 ease-in-out group-hover:-translate-y-12">
                <Image
                  src={
                    "https://th.bing.com/th/id/R.c01bfe8e1f11dfe3a1af580cfa3bbc89?rik=4XJslhCYu9u8CA&riu=http%3a%2f%2fhakomed.net%2fwp-content%2fuploads%2f2018%2f11%2f03.jpg&ehk=hVGis2mazsfZKbGSNt2KebgoX7%2b9lh%2bIUJTdYnIiXic%3d&risl=&pid=ImgRaw&r=0"
                  }
                  alt={doctor.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Main Content */}
              <div className="absolute bottom-0 left-0 w-full bg-white p-6 transition-transform duration-400 ease-in-out transform group-hover:-translate-y-16">
                <p className="text-2xl font-extrabold text-black uppercase tracking-wide text-center">
                  {doctor.name}
                </p>
                <p className="text-sm text-gray-600 text-center group-hover:opacity-0">
                  {doctor.certification}
                </p>
                <p className="text-sm text-gray-500 text-center group-hover:opacity-0">
                  Specialties: {doctor.specialties.join(", ")}
                </p>

                {/* Rating & Experience */}
                <div className="flex items-center justify-center space-x-2 mt-2 text-gray-600 text-sm group-hover:opacity-0">
                  <span className="text-yellow-500">★</span>
                  <span>
                    {doctor.rating} ({doctor.reviews} Reviews)
                  </span>
                  <span>•</span>
                  <span>{doctor.yearsOfExperience}+ Years</span>
                </div>
              </div>

              {/* Contact & Book Button */}
              <div className="absolute bottom-0 left-0 w-full bg-white py-4 opacity-0 transition-all duration-400 ease-in-out transform translate-y-12 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col items-center space-y-3 shadow-md">
                <div className="flex items-center text-gray-600 text-lg">
                  <FaPhone className="mr-2" />
                  {doctor.contactNumber}
                </div>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !session 
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg'
                  }`}
                  disabled={!session}
                >
                  {!session 
                    ? 'Login to Book'
                    : 'Book Appointment'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        doctor={selectedDoctor!}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default BookingPage;
