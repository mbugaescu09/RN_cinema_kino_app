import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  imageContainer: {
    
  },
  // Checkout the option to resize mode to 'contain' and size for image
  coverImage: {
    width: "100%",
    aspectRatio: 1
  },
  
  playButtomViewWrapper: {
    display: "flex",
    alignSelf: "center",
    
    borderRadius: 40, 
    borderWidth: .1, 
    backgroundColor: "lightgrey",
    
  },
  playButton: {
    color: "#1d1d27",
  },
  
  movieTitle: {
    fontFamily: "BureauGrotComp-Medium",
    color: "white",
    marginTop: "5%",
    marginLeft: "5%",
    marginRight: "20%",
    fontSize: 35
  },
  movieGenre: {
    fontFamily: "SourceSansPro-Bold",
    color: "#676d7c",
    marginLeft: "5%",
    marginTop: 5,
    marginRight: "10%",
    fontSize: 12,
    
  },

  LinearGradientUpper: {
    flex: 1,
    
  },

  LinearGradientLower: {
    flex: 1,
    
    
  }

})

export default styles;