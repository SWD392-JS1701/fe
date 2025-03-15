"use client";

import React, { useState } from "react";

interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  title: string;
  attendees: { name: string; image: string }[];
}

const ViewAppointment: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<string[]>(["April"]); // Default to current month expanded

  // Sample appointment data (replace with API data in a real app)
  const appointments: Appointment[] = [
    {
      id: "1",
      date: "2025-04-28",
      time: "09:00 - 09:30",
      location: "Online",
      title: "30min call meeting Peer <-> Leslie",
      attendees: [
        {
          name: "Peer",
          image:
            "https://storage.googleapis.com/a1aa/image/CxizdzQSZcBTXDfxU0V1xNOktTXW5w6YlEcO37wg6rk.jpg",
        },
        {
          name: "Leslie",
          image:
            "https://storage.googleapis.com/a1aa/image/9BtRVWstHBv08jvt1pkXcFSNrEKFKS0KzJ7mZjrvVXQ.jpg",
        },
      ],
    },
    {
      id: "2",
      date: "2025-04-30",
      time: "15:20 - 16:20",
      location: "Wework Paris",
      title: "Livn Product Demo",
      attendees: [
        {
          name: "Person 1",
          image:
            "https://storage.googleapis.com/a1aa/image/ufWBrbcIqje2MDo6M5enDKofNEYCS4r_yOPMbqPyX1E.jpg",
        },
        {
          name: "Person 2",
          image:
            "https://storage.googleapis.com/a1aa/image/-kszovfdnD4Mf0gRe9Th5K0YHyh3NEPsbPzWEChoNzg.jpg",
        },
        {
          name: "Person 3",
          image:
            "https://storage.googleapis.com/a1aa/image/x3itns_RlbacQpcfeq466cdzC_B94cWdptfAxNWUhOw.jpg",
        },
        {
          name: "Person 4",
          image:
            "https://storage.googleapis.com/a1aa/image/qyf8xPfpsNZB4F42MTK0pHlkOS38jube3FkhCi6nato.jpg",
        },
      ],
    },
    {
      id: "3",
      date: "2025-04-29",
      time: "11:15 - 11:45",
      location: "Online",
      title: "30min call meeting Olivia, Liam <-> Alban",
      attendees: [
        {
          name: "Olivia",
          image:
            "https://storage.googleapis.com/a1aa/image/DT_npARZNF9e9gSfKFFvURNacYRVD40gLE0vO01PkOA.jpg",
        },
        {
          name: "Liam",
          image:
            "https://storage.googleapis.com/a1aa/image/jow2qNSkpDJR25r7TW2MEZ_ZTl6_tLnx1ganUAXXjF8.jpg",
        },
        {
          name: "Alban",
          image:
            "https://storage.googleapis.com/a1aa/image/V_sfLZwySZAiiJMyy-FS5PYw3J2XwwZbI3Af5NFPl_4.jpg",
        },
      ],
    },
    {
      id: "4",
      date: "2025-05-02",
      time: "11:15 - 11:45",
      location: "Online",
      title: "30min call meeting Yulia, Alvin <-> Irina, Mae",
      attendees: [
        {
          name: "Yulia",
          image:
            "https://storage.googleapis.com/a1aa/image/6NAnmRjYT1lYkJToraMeyIfO6mxqMSr1O653f1aIJ3k.jpg",
        },
        {
          name: "Alvin",
          image:
            "https://storage.googleapis.com/a1aa/image/DfJAXLdujSk3fWsYoFEivsqzQlkjY6bL6u98OXgqh_c.jpg",
        },
        {
          name: "Irina",
          image:
            "https://storage.googleapis.com/a1aa/image/W36orcZy-OPWwR0suSEPFD5XnKIx-Zf0I6N-otWyNro.jpg",
        },
        {
          name: "Mae",
          image:
            "https://storage.googleapis.com/a1aa/image/sDn1fiuM6lVpbQRapb3t2o2J0ZfeQxe8P-Jl4Y73-mM.jpg",
        },
      ],
    },
    {
      id: "5",
      date: "2025-05-03",
      time: "10:45 - 11:45",
      location: "Online",
      title: "Livn Product Demo",
      attendees: [
        {
          name: "Person 1",
          image:
            "https://storage.googleapis.com/a1aa/image/ufWBrbcIqje2MDo6M5enDKofNEYCS4r_yOPMbqPyX1E.jpg",
        },
        {
          name: "Person 2",
          image:
            "https://storage.googleapis.com/a1aa/image/-kszovfdnD4Mf0gRe9Th5K0YHyh3NEPsbPzWEChoNzg.jpg",
        },
        {
          name: "Person 3",
          image:
            "https://storage.googleapis.com/a1aa/image/x3itns_RlbacQpcfeq466cdzC_B94cWdptfAxNWUhOw.jpg",
        },
      ],
    },
    {
      id: "6",
      date: "2025-05-04",
      time: "17:30 - 18:00",
      location: "Online",
      title: "Product meeting review",
      attendees: [
        {
          name: "Person 1",
          image:
            "https://storage.googleapis.com/a1aa/image/ufWBrbcIqje2MDo6M5enDKofNEYCS4r_yOPMbqPyX1E.jpg",
        },
        {
          name: "Person 2",
          image:
            "https://storage.googleapis.com/a1aa/image/-kszovfdnD4Mf0gRe9Th5K0YHyh3NEPsbPzWEChoNzg.jpg",
        },
        {
          name: "Person 3",
          image:
            "https://storage.googleapis.com/a1aa/image/x3itns_RlbacQpcfeq466cdzC_B94cWdptfAxNWUhOw.jpg",
        },
      ],
    },
  ];

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

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
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
                        <div className="relative w-full sm:w-auto">
                          <button
                            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-between sm:justify-center gap-2 hover:bg-gray-300"
                            onClick={() => toggleDropdown(appointment.id)}
                          >
                            Edit
                            <i
                              className={`fas fa-chevron-${
                                openDropdown === appointment.id ? "up" : "down"
                              }`}
                            ></i>
                          </button>
                          {openDropdown === appointment.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <a
                                href="#"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                Reschedule booking
                              </a>
                              <a
                                href="#"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                Request reschedule
                              </a>
                              <a
                                href="#"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                Edit location
                              </a>
                              <a
                                href="#"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                Invite people
                              </a>
                              <a
                                href="#"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                Cancel event
                              </a>
                            </div>
                          )}
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
