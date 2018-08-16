import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props) {
	return (
		<div className = {props.suit + " card"} onClick={() => props.onClick()}>{props.face}</div>
	);
}

function DeckDown(props) {
	let ddout;
	if(props.cards.length) {
		ddout = <Card suit="flipped" onClick={() => props.onClick()} />;
	} else {
		ddout = <Card suit="white" face="?" onClick={() => props.onClick()} />;
	}
	return (
		<div>{ddout}</div>
	);
}

function DeckUp(props) {
	let ddout = props.cards.map( item => <Card suit={item[1] + " hasright"} face={item[0]} /> );
	return (
		<div>{ddout}</div>
	);
}

function Home(props) {
	let ddout = props.cards.map( item => <Card suit={item[2] ? item[1] : "flipped"} face={item[0]} /> );
	return (
		<div>{ddout}</div>
	);
}

function Pile(props) {
	let l = props.cards.length;
	let ddout = Array(l);
	for(let i = 0; i < l - 1; i++) {
		ddout[i] = <Card suit={props.cards[i][2] ? props.cards[i][1] + " hasdown" : "flipped hasdown"} face={props.cards[i][2] ? props.cards[i][0] : ""} />
	}
	ddout[l-1] = <Card suit={props.cards[l-1][1] + " hasdown"} face={props.cards[l-1][0]} />
	return (
		<div>
			{ddout}
		</div>
	);
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		let deck = Array(52);

		for(let s = 0; s < 4; s++) {
			for(let f = 0; f < 13; f++) {
				let i = f + s*13;
				deck[i] = Array(3);
				switch(f) {
					case 0:
						deck[i][0] = 'A';
						break;
					case 10:
						deck[i][0] = 'J';
						break;
					case 11:
						deck[i][0] = 'Q';
						break;
					case 12:
						deck[i][0] = 'K';
						break;
					default:
						deck[i][0] = f+1;
						break;
				}
				switch(s) {
					case 0:
						deck[i][1] = 'red';
						break;
					case 1:
						deck[i][1] = 'green';
						break;
					case 2:
						deck[i][1] = 'blue';
						break;
					case 3:
						deck[i][1] = 'black';
						break;
				}
				deck[i][2] = true;
			}
		}

		const fillPile = (pile) => {
			for(let i = 0; i < pile.length; i++) {
				let pick = Math.floor(Math.random() * deck.length);
				pile[i] = deck[pick];
				deck.splice(pick,1);
				pile[i][2] = false;
			}
			pile[pile.length-1][2] = true;
		};

		let pile = Array(7).fill(null);
		for(let i = 0; i < pile.length; i++) {
			pile[i] = Array(i+1).fill(null);
			fillPile(pile[i])
		}

		let deckDown = Array(24).fill(null);
		fillPile(deckDown);
		
		this.state = {
			deckDown: deckDown,
			deckUp: Array(0).fill(null),
			home1: Array(0).fill(null),
			home2: Array(0).fill(null),
			home3: Array(0).fill(null),
			home4: Array(0).fill(null),
			pile1: pile[0],
			pile2: pile[1],
			pile3: pile[2],
			pile4: pile[3],
			pile5: pile[4],
			pile6: pile[5],
			pile7: pile[6],
		};
	}

	deckDownFlip() {
		let deckDown = this.state.deckDown;
		let i = (deckDown.length > 3) ? deckDown.length - 3 : 0;
		let l = (deckDown.length > 3) ? 3 : deckDown.length;
		let deckUp = deckDown.splice(i,l);

		this.setState({
			deckDown: deckDown,
			deckUp: deckUp,
			home1: this.state.home1,
			home2: this.state.home2,
			home3: this.state.home3,
			home4: this.state.home4,
			pile1: this.state.pile1,
			pile2: this.state.pile2,
			pile3: this.state.pile3,
			pile4: this.state.pile4,
			pile5: this.state.pile5,
			pile6: this.state.pile6,
			pile7: this.state.pile7,
		});
	}

	render() {
		return (
			<table border='1' cellSpacing='10'>
				<tr>
					<td><DeckDown cards={this.state.deckDown} onClick={() => this.deckDownFlip()} /></td>
					<td colSpan='2'><DeckUp cards={this.state.deckUp} /></td>
					<td><Home cards={this.state.home1} /></td>
					<td><Home cards={this.state.home2} /></td>
					<td><Home cards={this.state.home3} /></td>
					<td><Home cards={this.state.home4} /></td>
				</tr>
				<tr>
					<td><Pile cards={this.state.pile1} /></td>
					<td><Pile cards={this.state.pile2} /></td>
					<td><Pile cards={this.state.pile3} /></td>
					<td><Pile cards={this.state.pile4} /></td>
					<td><Pile cards={this.state.pile5} /></td>
					<td><Pile cards={this.state.pile6} /></td>
					<td><Pile cards={this.state.pile7} /></td>
				</tr>
			</table>
		);
	}
}



ReactDOM.render(
	<Game />,
	document.getElementById('root')
);