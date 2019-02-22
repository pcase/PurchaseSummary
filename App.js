/**
 React Native Purchase Summary App
 */

import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {AppRegistry, Platform, StyleSheet, Text, TextInput, FlatList, View, Button, Image, Linking, Modal, LayoutAnimation, UIManager, TouchableOpacity, TouchableHighlight} from 'react-native';
import ListItem from './components/ListItem';
import { connect } from 'react-redux';
import { addPlace } from './actions/place';
import data from './price.json';

const pickupText = 'Picking up your order in the store helps cut costs, and we pass the savings on to you.'
	 
class PurchaseSummary extends Component {
	
	getTotal = () => {
		var price = parseFloat(data.items[0].price, 10);
		var savings = parseFloat(data.items[0].savings, 10);
		var tax = parseFloat(data.items[0].taxes, 10);
		return price - savings + tax;
	};  
	
    constructor() {
        super();
		
        this.icons = {    
            'up'    : require('./assets/images/plus.png'),
            'down'  : require('./assets/images/minus.jpg'),
			'item'	: require('./assets/images/drone.jpeg')
        };
 
        this.state = { onLayoutHeight: 0, modifiedHeight: 0, expanded: false }
 	   	this.state.modalVisible = false
 	   	this.state.estimatedTotal = this.getTotal().toString()
		
        if( Platform.OS === 'android' ) {
          UIManager.setLayoutAnimationEnabledExperimental( true )
        }
    }
	
	state = {
	 	code: '',
	   	estimatedTotal: '',
	   	places: [],
		modalVisible: false
	}

	codeSubmitHandler = () => {
	   if (this.state.code.trim() === '') {
	      return;
	   }
	   if (this.state.code === 'DISCOUNT') {
		   this.state.  estimatedTotal = this.getDiscount().toString();
	   	   this.props.add(this.state.  estimatedTotal);
   	   }
	}
	
	estimatedTotalChangeHandler = (value) => {
		 this.setState({
	 	   code: value
	 	 });    
	}

	placesOutput = () => {
		  return (
		   <FlatList style = { styles.listContainer }
		     data = { this.props.places }
		     keyExtractor={(item, index) => index.toString()}
		     renderItem = { info => (
		       <ListItem 
		           estimatedTotal={ info.item.value }
		       />
		     )}
		  />
		 )
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
  
    _handleButtonPress = () => {
      this.setModalVisible(true);
    };
	
    setModalVisible = (visible) => {
      this.setState({modalVisible: visible});
    };
	
	getDiscount = () => {
		var total = this.getTotal();
		var discountPrice = total - total/10;
		return discountPrice.toFixed(2);
	}
	
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
        	  animationType='none'
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
			  {data.items[0].price}{"\n"}{"\n"}
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
			  {this.state.estimatedTotal}{"\n"}{"\n"}
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
				   <View style = { styles.inputContainer }>
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
  		 	      <View style = { styles.inputContainer }>
  		 	        <TextInput
  		 	          placeholder = "Promo code"
  		 	          style = { styles.placeInput }
  		 	          value = { this.state.code }
  		 	          onChangeText = { this.estimatedTotalChangeHandler }
  		 	        ></TextInput>
  		 	        <Button title = 'Apply' 
  		 	          style = { styles.placeButton }
  		 	          onPress = { this.codeSubmitHandler }
  		 	        />
  		 	        </View>
  		 	        <View style = { styles.listContainer }>
  		 	          { this.placesOutput() }
  		 	        </View>		
               </View>
            </View>
		</View>
    );
  }
}

const styles = StyleSheet.create ({
    container2: {
      paddingTop: 30,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    placeInput: {
      width: '70%'
    },
    placeButton: {
      width: '30%'
    },
    listContainer: {
      width: '100%'
    },
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

const mapStateToProps = state => {
  return {
    places: state.places.places
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (name) => {
      dispatch(addPlace(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseSummary)