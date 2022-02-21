import React, { useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import './styles.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    DELETE_DIGIT: 'delete-digit',
    ADD_OPERATION: 'add-operation',
    CLEAR: 'clear',
    EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
    switch(type){
        case ACTIONS.ADD_DIGIT:
            if(state.overwrite){
                return{
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            if(payload.digit === '0' && state.currentOperand === '0') return state
            if(state.currentOperand == null && payload.digit === '.') return state
            if(payload.digit === '.' && state.currentOperand.includes('.')) return state
            return{
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`
            }
        case ACTIONS.CLEAR:
            return{}
        case ACTIONS.ADD_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null)
                return state
            if (state.currentOperand == null)
                return{
                    ...state,
                    operation: payload.operation
                }
            if (state.previousOperand == null)
                return{
                    ...state,
                    previousOperand: state.currentOperand,
                    operation: payload.operation,
                    currentOperand: null
                }
            return{
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }
        case ACTIONS.EVALUATE:
            if ( state.currentOperand == null || state.previousOperand == null || state.operation == null ){
                return state
            }
            return{
                ...state,
                previousOperand: null,
                operation: null,
                overwrite: true,
                currentOperand: evaluate(state),
            }
        case ACTIONS.DELETE_DIGIT:
            if(state.overwrite){
                return{
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if(state.currentOperand == null) return state
            if(state.currentOperand.length === 1){
                return{
                    ...state,
                    currentOperand: null
                }
            }

            return{
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
    }
}

function evaluate ({currentOperand, previousOperand, operation}) {
    const current = parseFloat(currentOperand);
    const prev = parseFloat(previousOperand);

    if(isNaN(current) || isNaN(prev)) return ''

    let calculation = ''

    switch(operation){
        case '+':
            calculation = prev + current
            break
        case '-':
            calculation = prev - current
            break
        case '*':
            calculation = prev * current
            break
        case '÷':
            calculation = prev / current
            break
    }

    return calculation.toString();
}


export default function App () {
    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

    return(
        <div className='calculator-grid'>
            <div className="output">
                <div className="previous-operand">{previousOperand}{operation}</div>
                <div className="current-operand">{currentOperand}</div>
            </div>
            <button className='span-two' onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
            <button onClick={()=> dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
                <OperationButton operation='÷' dispatch={dispatch} />
            <DigitButton digit='1' dispatch={dispatch}/>
            <DigitButton digit='2' dispatch={dispatch}/>
            <DigitButton digit='3' dispatch={dispatch}/>
                <OperationButton operation='*' dispatch={dispatch} />
            <DigitButton digit='4' dispatch={dispatch}/>
            <DigitButton digit='5' dispatch={dispatch}/>
            <DigitButton digit='6' dispatch={dispatch}/>
                <OperationButton operation='+' dispatch={dispatch} />
            <DigitButton digit='7' dispatch={dispatch}/>
            <DigitButton digit='8' dispatch={dispatch}/>
            <DigitButton digit='9' dispatch={dispatch}/>
                <OperationButton operation='-' dispatch={dispatch} />
            <DigitButton digit='.' dispatch={dispatch}/>
            <DigitButton digit='0' dispatch={dispatch}/>
                <button className='span-two' onClick={()=> dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>
    );
}