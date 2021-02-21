import React, { useState, useContext } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Context } from "../../context/AuthContext"

import WebViewModal from "../../modals/WebViewModal"

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({email: false, password: false})
  const [url, setUrl] = useState("");
  const { state, signin, clearErrorMessage } = useContext(Context);

  const handleInputFocus = (textinput) => {
    setIsFocused({
      [textinput]: true
    })
  }
  const handleInputBlur = (textinput) => {
    setIsFocused({
      [textinput]: false
    })
  }

  return (
    <View style={styles.container}>

      <WebViewModal
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
        url={url}
      />
      <Text style={styles.header}>Login med din Kino profil</Text>
      <Text style={styles.errorMessage}>{state.errorMessage ? state.errorMessage : " "}</Text>
      <TextInput 
        style={isFocused.email ? [styles.inputField, { borderColor: 'white' }] : styles.inputField}
        placeholder={"Email"}
        placeholderTextColor="#676d7c"
        color="#676d7c"
        paddingLeft={10}
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        blurOnSubmit={true}
        keyboardType={"email-address"}
        textContentType={"emailAddress"}
        onFocus={() => handleInputFocus('email')}
        onBlur={() => handleInputBlur('email')}
      />
      <TextInput 
        secureTextEntry
        style={isFocused.password ? [styles.inputField, { borderColor: 'white' }] : styles.inputField}
        placeholder={"Password"}
        placeholderTextColor="#676d7c"
        color="#676d7c"
        paddingLeft={10}
        onChangeText={setPassword}
        value={password}
        autoCapitalize="none"
        autoCorrect={false}
        blurOnSubmit={true}
        textContentType={"password"}
        onFocus={() => handleInputFocus('password')}
        onBlur={() => handleInputBlur('password')}
      />
      <TouchableOpacity
      onPress={() => {
        signin({ username, password });
        setUsername("");
        
        } 
      }
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.webViewLinksContainer}> 
        <TouchableOpacity
          onPress={() => [
            setModalVisible(true),
            setUrl("https://www.kino.dk/user/password/")
          ]}
        >
          <Text style={styles.webViewLinksText}>Kan du ikke huske din kode? Tryk her</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => [
            setModalVisible(true),
            setUrl("https://www.kino.dk/user/register")
          ]}
        >
          <Text style={styles.webViewLinksText}>Har du ingen profil? Tryk her</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "10%",
    backgroundColor: '#1d1d27',
  },
  header: {
    textAlign: "center",
    color: '#676d7c',
    fontSize: 25,
    marginTop: "10%",
    marginBottom: "15%",
    fontFamily: "BureauGrotComp-Medium",
  }, 
  errorMessage: {
    color: "tomato", 
    fontSize: 16,
    marginLeft: 15,
    marginBottom: 15,
    fontFamily: "SourceSansPro-Bold", 
  },
  inputField: {
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "5%",
    height: 40,
    borderWidth: 0.8, 
    borderColor: "#676d7c",
    borderRadius: 5, 
    fontFamily: "SourceSansPro-Bold", 
  },
  button: {
    alignSelf: "center",
    fontSize: 30,
    backgroundColor: "#ff321e",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: 23,
  },
  buttonText: {
    color: "white",
    fontFamily: "SourceSansPro-Bold", 
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 5
  }, 
  webViewLinksContainer: {
    margin: 15
  },
  webViewLinksText: {
    fontFamily: "SourceSansPro-Bold", 
    fontSize: 14, 
    color: '#676d7c', 
    marginBottom: 20
  }
})

export default UserLogin;
