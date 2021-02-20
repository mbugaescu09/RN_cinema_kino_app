import React, { useContext } from "react";
import { View, StyleSheet } from "react-native"
import getUser from "../helpers/getUser";
import { Context } from "../context/AuthContext"

import UserLogin from "../components/users/UserLogin";
import Profile from "../components/users/Profile";

const User = () => {
  const { user } = useContext(Context)
  
  return (
    <View style={styles.container}>
      { 
        user ? <Profile user={user} /> : <UserLogin />  
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d27",
  }, 

})

export default User;