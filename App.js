/**
 React Native Purchase Summary App
 */

import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View, Button, Image, Linking, Modal, LayoutAnimation, UIManager, TouchableOpacity} from 'react-native';
import data from './price.json';

const pickupText = 'Picking up your order in the store helps cut costs, and we pass the savings on to you.'

export default class PurchaseSummary extends Component {
	
    constructor() {
        super();
		
        this.icons = {    
            'up'    : require('./assets/images/plus.png'),
            'down'  : require('./assets/images/minus.jpg'),
			'item'	: require('./assets/images/drone.jpeg')
        };
 
        this.state = { onLayoutHeight: 0, modifiedHeight: 0, expanded: false }
 
        if( Platform.OS === 'android' ) {
          UIManager.setLayoutAnimationEnabledExperimental( true )
        }
    }
 
    changeLayout = () => {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
 
        if( this.state.expanded === false )
            this.setState({ modifiedHeight: this.state.onLayoutHeight, expanded: true });
        else
            this.setState({ modifiedHeight: 0, expanded: false });
    }
 
    getViewHeight( height ) {
        this.setState({ onLayoutHeight: height });
    }
	
    state = {
      modalVisible: false,
    };
  
    _handleButtonPress = () => {
      this.setModalVisible(true);
    };
	
    setModalVisible = (visible) => {
      this.setState({modalVisible: visible});
    };
	
  render() {
      var modalBackgroundStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      };
	  var innerContainerTransparentStyle = {backgroundColor: '#fff', padding: 20};

	  let itemImage = this.icons['item'];
	  let icon = this.icons['up'];

      if (this.state.expanded){
          icon = this.icons['down'];   
      }
	  
    return ( 
		<View style = {styles.container}>
		
    		<Modal
        	  animationType='fade'
        	  transparent={true}
        	  visible={this.state.modalVisible}
        	  onRequestClose={() => this.setModalVisible(false)}
        	>
        		<View style={[styles.container, modalBackgroundStyle]}>
          			<View style={innerContainerTransparentStyle}>
            			<Text>{pickupText}</Text>
            			<Button title='Close'
              			onPress={this.setModalVisible.bind(this, false)}/>
          			</View>
        	  	</View>
      	  	</Modal>
      
			<Text style = {styles.wordBold}>
			  Purchase Summary{"\n"}{"\n"}
			</Text>
			
			<Text>
         	  Subtotal
      		</Text>

			<Text style={{alignSelf: 'flex-end'}}>
			  {data.items[0].subtotal}{"\n"}{"\n"}
			</Text>  
      
			<Text style={{textDecorationLine: 'underline'}} onPress={this._handleButtonPress}>
         	  Pickup savings
      		</Text>

			<Text style={{alignSelf: 'flex-end', color: 'red'}}>
			  -{data.items[0].savings}{"\n"}{"\n"}
			</Text>    
      
      		<Text>
         	  Est taxes & fees{"\n"}
	   	  	  (Based on 95070)
      	  	</Text>
      
			<Text style={{alignSelf: 'flex-end'}}>
			  {data.items[0].taxes}{"\n"}{"\n"}
			</Text>   
			  
      	  	<Text>
	   	 	  {"\n"}
         	  Est total
      	  	</Text>
			  
			    
			<Text style={{alignSelf: 'flex-end'}}>
			  {data.total}{"\n"}{"\n"}
			</Text>     
		  
           <View style = { styles.btnTextHolder }>
               <TouchableOpacity activeOpacity = { 0.0 } onPress = { this.changeLayout } style = { styles.Btn }>
			    <View style = {{flexDirection:'row', flexWrap:'wrap'}}>
               		<Text style={styles.btnText}>See item details</Text>
          	   		<Image
              			style={styles.buttonImage}
              			source={icon}>
          	   			</Image>
			    </View>
               </TouchableOpacity>
               <View style = {{height: this.state.modifiedHeight, overflow: 'hidden'}}>
				   <View style = {{flexDirection:'row', flexWrap:'wrap'}}>
          	   	   	 <Image
              		 	style={styles.buttonImage}
              		 	source={itemImage}>
          	   	   	 </Image>
                   	 <Text style = { styles.text } onLayout = {( event ) => this.getViewHeight( event.nativeEvent.layout.height )}>
                       {data.items[0].description}
                   	 </Text>
				  </View>
               </View>
            </View>
			  
           <View style = { styles.btnTextHolder }>
               <TouchableOpacity activeOpacity = { 0.0 } onPress = { this.changeLayout } style = { styles.Btn }>
				 <View style = {{flexDirection:'row', flexWrap:'wrap'}}>
               	 	  <Text style={styles.btnText}>Apply promo code</Text>
          	   	 	  <Image
              			style={styles.buttonImage}
              			source={icon}
          	   	 	   ></Image>
				 </View>
               </TouchableOpacity>
               <View style = {{ height: this.state.modifiedHeight, overflow: 'hidden' }}>
                   <Text style = { styles.text } onLayout = {( event ) => this.getViewHeight( event.nativeEvent.layout.height )}>
                       Promo code
                   </Text>
               </View>
            </View>
   		
		</View>
    );
  }
}

const styles = StyleSheet.create ({
   container: {
	  flex: 1,
      marginTop: 100,
      padding: 20,
      paddingHorizontal: 10,
      paddingTop: 20,
	  backgroundColor: '#F5FCFF'
   },
   text: {
     fontSize: 17,
     color: 'black',
     padding: 10
   },
   textLeft: {
      color: 'black',
	  textAlign: 'left',
	  alignSelf: 'stretch'
   },
   textRight: {
      color: 'black',
	  textAlign: 'right',
	  alignSelf: 'stretch'
   },
   capitalLetter: {
      color: 'red',
      fontSize: 20
   },
   wordBold: {
      fontWeight: 'bold',
      color: 'black'
   },
   italicText: {
      color: '#37859b',
      fontStyle: 'italic'
   },
   textShadow: {
      textShadowColor: 'red',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius : 5
   },
   btnText: {
       textAlign: 'left',
       color: 'black',
	   textDecorationLine: 'underline'
	   
   },

   btnTextHolder: {
       borderWidth: 1,
       borderColor: '#F5FCFF'
   },

   Btn: {
       padding: 10,
       backgroundColor: '#F5FCFF'
   },
   buttonImage : {
       width   : 30,
       height  : 25
   },
});
