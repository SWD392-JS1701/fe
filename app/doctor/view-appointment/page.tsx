"use client";

import React, { useState, FC } from "react";
import { Appointment } from "@/app/types/appointment";
import { appointments } from "@/app/data/appoitmentsData";

const ViewAppointment: FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedMonths, setExpandedMonths] = useState<string[]>(["April"]);
  const tabs = ["upcoming", "pending", "cancelled"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      dayName: date.toLocaleString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleString("en-US", { month: "long" }),
    };
  };

  const groupByMonth = (appointments: Appointment[]) => {
    return appointments.reduce((acc, appointment) => {
      const { month } = formatDate(appointment.date);
      if (!acc[month]) acc[month] = [];
      acc[month].push(appointment);
      return acc;
    }, {} as Record<string, Appointment[]>);
  };

  const filteredAppointments = appointments.filter((appt) => {
    return activeTab === "upcoming";
  });

  const groupedAppointments = groupByMonth(filteredAppointments);

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 mt-30">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bookings</h1>
        <p className="text-gray-600 mb-6">
          See your scheduled events from your calendar links.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointments */}
        {Object.entries(groupedAppointments).map(
          ([month, monthAppointments]) => (
            <div key={month} className="mb-6">
              <button
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 mb-2"
                onClick={() => toggleMonth(month)}
              >
                <span>{month}</span>
                <span>{expandedMonths.includes(month) ? "▲" : "▼"}</span>
              </button>
              {expandedMonths.includes(month) && (
                <div className="space-y-4">
                  {monthAppointments.map((appointment) => {
                    const { dayName, dayNumber } = formatDate(appointment.date);
                    return (
                      <div
                        key={appointment.id}
                        className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="text-center min-w-[60px]">
                            <div
                              className={`font-bold ${
                                dayName === "Wed"
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {dayName}
                            </div>
                            <div
                              className={`text-2xl font-bold ${
                                dayName === "Wed"
                                  ? "text-red-500"
                                  : "text-gray-800"
                              }`}
                            >
                              {dayNumber}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-gray-800">
                              <i className="fas fa-clock text-gray-500"></i>
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-gray-800">
                              <i className="fas fa-map-marker-alt text-gray-500"></i>
                              <span>{appointment.location}</span>
                            </div>
                            <div className="mt-2 text-gray-800 font-medium">
                              {appointment.title}
                            </div>
                            <div className="flex mt-2">
                              {appointment.attendees.map((attendee, idx) => (
                                <img
                                  key={idx}
                                  src={attendee.image}
                                  alt={attendee.name}
                                  className="w-6 h-6 rounded-full border-2 border-white"
                                  style={{ marginLeft: idx > 0 ? "-8px" : "0" }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}

        {filteredAppointments.length === 0 && (
          <p className="text-gray-600 text-center">
            No appointments found for {activeTab}.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewAppointment;
