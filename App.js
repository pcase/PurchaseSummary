/**
 React Native Purchase Summary App
 */

import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {AppRegistry, Platform, StyleSheet, Text, TextInput, View, Button, Image, Modal, FlatList, LayoutAnimation, UIManager, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
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
            'plus'    : require('./assets/images/plus.png'),
            'minus'  : require('./assets/images/minus.jpg'),
			'item'	: require('./assets/images/drone.jpeg')
        };
 
		this.state.onLayoutHeight = 0;
		this.state.modifiedHeight = 0;
		this.state.expanded = false;
 	   	this.state.modalVisible = false;
 	   	this.state.estimatedTotal = this.getTotal().toString();
		this.state.discountApplied = false;
		
        if( Platform.OS === 'android' ) {
          UIManager.setLayoutAnimationEnabledExperimental( true )
        }
    }
	
	state = {
	 	code: '',
	   	estimatedTotal: '',
	   	places: [],
		modalVisible: false,
		onLayoutHeight: 0,
		modifiedHeight: 0,
		expanded: false,
		discountApplied: false
	}

	codeSubmitHandler = () => {
	   if (this.state.code.trim() === '') {
	      return;
	   }
	   if (this.state.code === 'DISCOUNT' && !this.state.discountApplied) {
		   this.state.  estimatedTotal = this.getDiscount().toString();
	   	   this.props.add(this.state.  estimatedTotal);
		   this.state.discountApplied = true;
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
	  let icon = this.icons['plus'];

      if (this.state.expanded){
          icon = this.icons['minus'];   
      }
	  
    return ( 
		<View style = {styles.container}>
		 	
    		<Modal
        	  animationType='none'
        	  transparent={true}
        	  visible={this.state.modalVisible}
        	  onRequestClose={() => this.setModalVisible(false)}
        	>
      			<TouchableWithoutFeedback onPress={this.setModalVisible.bind(this, false)}>
          			<View style={styles.modalOverlay} />
        		</TouchableWithoutFeedback>
			  
        		<View style={[styles.container, modalBackgroundStyle]}>
          			<View style={innerContainerTransparentStyle}>
            			<Text>{pickupText}</Text>
          			</View>
        	  	</View>
      	  	</Modal>
			
			 <View style = {{flexDirection:'row', justifyContent: 'space-between'}}>
				<Text>
         	  		Subtotal
      			</Text>
				<Text>
	  				${data.items[0].price}{"\n"}{"\n"}
				</Text>  
			 </View>
      
	  		<View style = {{flexDirection:'row', justifyContent: 'space-between'}}>
				<Text style={{textDecorationLine: 'underline'}} onPress={this._handleButtonPress}>
         	  	  	Pickup savings
      			</Text>
			  
				<Text style={{alignSelf: 'flex-end', color: 'red'}}>
			  	  -${data.items[0].savings}{"\n"}{"\n"}
				</Text>    
      		</View>
			 
			<View style = {{flexDirection:'row', justifyContent: 'space-between'}}>    
      			<Text>
         	  	  Est. taxes & fees{"\n"}
	   	  	  	  (Based on 95070)
      	  		</Text>
      
				<Text style={{alignSelf: 'flex-end'}}>
			  	  ${data.items[0].taxes}{"\n"}{"\n"}
				</Text>   
			</View>  
			
			<View style = {{flexDirection:'row', justifyContent: 'space-between'}}>    
      	  		<Text style={styles.wordBoldLarge}>
         	  	Est. total
      	  		</Text>
			  	    
				<Text style={{alignSelf: 'flex-end'}}>
			  		<Text style={styles.wordBoldLarge}>
			  		${this.state.estimatedTotal}{"\n"}
			  	  </Text>
				</Text> 
			</View>    
						  
           <View style = { styles.btnTextHolder }>
               <TouchableOpacity activeOpacity = { 0.0 } onPress = { this.changeLayout } style = { styles.Btn }>
			    <View style = {{flexDirection:'row', justifyContent: 'space-between'}}>
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
				 <View style = {{flexDirection:'row', justifyContent: 'space-between'}}>
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
  		 	          style = { styles.promoInput }
  		 	          value = { this.state.code }
  		 	          onChangeText = { this.estimatedTotalChangeHandler }
  		 	        ></TextInput>
  		 	        <Button title = 'Apply' 
  		 	          style = { styles.promoButton }
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
    modalOverlay: {
       position: 'absolute',
       top: 0,
       bottom: 0,
       left: 0,
       right: 0,
       backgroundColor: 'rgba(0,0,0,0.5)'
     },
    container2: {
      paddingTop: 30,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      width: '90%',
	  height: 120
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    leftContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: '#F5FCFF'
    },
    rightContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    promoInput: {
      width: '70%',
      borderColor: 'black',
      borderWidth: 1
    },
    promoButton: {
    	backgroundColor: 'blue',
    	borderColor: 'black',
    	borderWidth: 1,
    	borderRadius: 12,
    	color: 'white',
    	fontSize: 24,
    	fontWeight: 'bold',
    	overflow: 'hidden',
    	padding: 12,
    	textAlign:'center'
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
   row: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#F5FCFF',
   },
   text: {
     fontSize: 20,
     color: 'black',
     padding: 10
   },
   wordBoldLarge: {
	  fontSize: 30,
      fontWeight: 'bold',
      color: 'black'
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