import React, { FC } from "react";
import UserProfile from "../../../components/UserProfile";

const ProfilePage: FC = () => {
  const userData = {
    firstName: "Nguyenanhanh",
    lastName: "",
    email: "vunguyen0114@gmail.com",
    skinType: "OSNW",
    sensitivity: "Acne",
    emailSubscription: "Unsubscribed",
    totalSpent: 0,
    orderCount: 0,
    addressCount: 1,
  };

  return <UserProfile user={userData} />;
};

export default ProfilePage;
