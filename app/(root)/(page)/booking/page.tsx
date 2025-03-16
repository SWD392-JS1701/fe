"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaPhone } from "react-icons/fa";
import { Doctor } from "../../../types/doctor";
import { initialDoctors } from "../../../data/initialDoctors";
import BookingModal from "@/components/BookingModal";

const BookingPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    gender: "All",
    experience: 5,
    minFee: 40,
    maxFee: 200,
    availability: "Morning",
    consultType: "On-site",
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setDoctors(initialDoctors);
    setFilteredDoctors(initialDoctors);
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doctor) => {
      const matchesGender =
        filters.gender === "All" ||
        (filters.gender === "Male Doctor" && doctor.gender === "Male") ||
        (filters.gender === "Female Doctor" && doctor.gender === "Female");
      const matchesExperience = doctor.yearsOfExperience >= filters.experience;
      const matchesFee =
        doctor.consultationFee >= filters.minFee &&
        doctor.consultationFee <= filters.maxFee;
      const matchesAvailability = doctor.availability === filters.availability;
      const matchesConsultType =
        (filters.consultType === "On-site" && doctor.consultationFee > 0) ||
        (filters.consultType === "Home Visit" && doctor.sessionFee > 0);

      return (
        matchesGender &&
        matchesExperience &&
        matchesFee &&
        matchesAvailability &&
        matchesConsultType
      );
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
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleModalConfirm = (selectedSlot: { date: string; time: string }) => {
    console.log("Appointment booked for", selectedDoctor?.name, selectedSlot);
    setIsModalOpen(false);
  };

  return (
    <div className="relative pt-32 pb-10 p-8 min-h-screen bg-gray-50">
      <div className=" flex justify-between items-center mt-">
        <div>
          <h2 className="text-2xl font-extrabold italic text-black tracking-tight">
            {filteredDoctors.length} Doctors Available
          </h2>
        </div>

        <div className="flex gap-4">
          {/* Nút Filter */}
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

        {/* Gender Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="space-y-2">
            {["All", "Male Doctor", "Female Doctor"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={tempFilters.gender === option}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience
          </label>
          <select
            value={tempFilters.experience}
            onChange={(e) =>
              handleFilterChange("experience", Number(e.target.value))
            }
            className="w-full p-2 border rounded-md"
          >
            {[1, 5, 10, 15].map((exp) => (
              <option key={exp} value={exp}>
                {exp}+ Years
              </option>
            ))}
          </select>
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
          <select
            value={tempFilters.availability}
            onChange={(e) => handleFilterChange("availability", e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {["Morning", "Afternoon", "Evening"].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Consult Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consult Type
          </label>
          <div className="space-y-2">
            {["On-site", "Home Visit"].map((type) => (
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
            setFilters(tempFilters); // Áp dụng filter
            setIsFilterVisible(false); // Đóng filter sidebar
          }}
          className="w-full bg-black text-white py-2 rounded-md text-lg mt-4"
        >
          Apply Filter
        </button>
      </div>

      {/* Doctors List Section */}
      <div className="w-full md:w-3/4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="relative overflow-hidden rounded-xl shadow-lg group w-full h-[450px] bg-white"
            >
              {/* Hình ảnh bác sĩ */}
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

              {/* Nội dung chính */}
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
                <p className="text-sm text-gray-500 text-center transition-all duration-300 group-hover:text-xl group-hover:font-bold group-hover:text-orange-500">
                  ${doctor.consultationFee} Consultation Fee
                </p>

                {/* Đánh giá & Kinh nghiệm */}
                <div className="flex items-center justify-center space-x-2 mt-2 text-gray-600 text-sm group-hover:opacity-0">
                  <span className="text-yellow-500">★</span>
                  <span>
                    {doctor.rating} ({doctor.reviews} Reviews)
                  </span>
                  <span>•</span>
                  <span>{doctor.yearsOfExperience}+ Years</span>
                  <span>•</span>
                  <span>{doctor.location}</span>
                </div>
              </div>

              {/* Số điện thoại & Nút đặt lịch */}
              <div className="absolute bottom-0 left-0 w-full bg-white py-4 opacity-0 transition-all duration-400 ease-in-out transform translate-y-12 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col items-center space-y-3 shadow-md">
                <div className="flex items-center text-gray-600 text-lg">
                  <FaPhone className="mr-2" />
                  {doctor.contactNumber}
                </div>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition"
                >
                  Book Appointment
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
