/*
	Title: 			jquery.StateMachine.js
	Author: 		James R. Brown
	Date: 			9/24/13
	Version: 		1
	
	The MIT License (MIT)
	Copyright (c) 2013 James R. Brown
	
	Permission is hereby granted, free of charge, to any person obtaining 
	a copy of this software and associated documentation files (the "Software"), 
	to deal in the Software without restriction, including without limitation 
	the rights to use, copy, modify, merge, publish, distribute, sublicense, 
	and/or sell copies of the Software, and to permit persons to whom the Software 
	is furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in 
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
	INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
	PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
	CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
	OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Needed filters
jQuery.expr[':'].data = function(a,i,m) { 
    var e = jQuery(a).get(0), keyVal; 
    if(!m[3]) { 
        for (var x in e) { if((/jQuery\d+/).test(x)) { return true; } }
    } else { 
        keyVal = m[3].split('='); 
        if (keyVal[1]) { 
            if((/^\/.+\/([mig]+)?$/).test(keyVal[1])) {
                return
                 (new RegExp(
                     keyVal[1].substr(1,keyVal[1].lastIndexOf('/')-1),
                     keyVal[1].substr(keyVal[1].lastIndexOf('/')+1))
                  ).test(jQuery(a).data(keyVal[0]));
            } else {
                return jQuery(a).data(keyVal[0]) == keyVal[1];
            } 
        } else { 
            if(jQuery(a).data(keyVal[0])) {
                return true;
            } else {
                jQuery(a).removeData(keyVal[0]);
                return false;
            } 
        }
    } 
    return false; 
};

jQuery.expr[':'].dataObj = function(a,i,m) { 
    var p = m[3].match(/([^,]+)/g);
    var state = p[0];
    var condition = p[1];
    var matches = 0; 
    
    jQuery(a).each(function(){
        if($(this).data(state)){
            if($(this).data(state)[condition]){
                matches++;
            }
        }
    });

    return matches > 0;
};

jQuery.expr[':'].dataHasConditions = function(a,i,m) { 
    var state = m[3];
    var matches = 0; 
        
    jQuery(a).each(function(){
        if($(this).data(state)){
            if($(this).data(state)){
                for(var condition in $(this).data(state)){
                    matches++;
                    break;
                }
            }
        }
    });

    return matches > 0;
};

jQuery.extend( jQuery.fn, {
    addStateMachine: function(state) {
        //adds elms to statemachine
        $(this).each(function(){
            if($(this).data("StateMachine_"+state)){
                
            }else{
                $(this).data("StateMachine_"+state, new Object());
            }
        });        
        return $(this);
    },
    removeStateMachine: function(state) {
        //removes elms from statemachine
        $(this).each(function(){
            $(this).removeData("StateMachine_"+state);
        });
        return $(this);
    },
    inStateMachine: function(state) {
        return $(this).filter(':data(StateMachine_'+state+')');
    },
    notInStateMachine: function(state) {
        return $(this).filter(':not(:data(StateMachine_'+state+'))');
    },
    addStateCondition: function(state, condition) {
        var operateOver = $(this).inStateMachine(state);
        if(operateOver)
            operateOver.each(function(){
                $(this).data("StateMachine_"+state)[condition] = true;
            });  
        return operateOver;
    },
    removeStateCondition: function(state, condition) {
        var operateOver = $(this).inStateMachine(state);
        if(operateOver)
            operateOver.each(function(){
                delete $(this).data("StateMachine_"+state)[condition];
            });
        return operateOver;
    },    
    clearStateConditions: function(state) {
        $(this).each(function(){
            $(this).data("StateMachine_"+state, new Object());
        });
        return $(this);
    },
    hasStateCondition: function(state, condition) {
        return $(this).filter(':dataObj(StateMachine_'+state+','+condition+')');
    },    
    notStateCondition: function(state, condition) {
        return $(this).filter(':not(:dataObj(StateMachine_'+state+','+condition+'))');
    },
    stateMachineHasConditions: function(state) {
        return $(this).filter(':dataHasConditions(StateMachine_'+state+')');
    },    
    stateMachineNoConditions: function(state) {
        return $(this).filter(':not(:dataHasConditions(StateMachine_'+state+'))');
    }
});
