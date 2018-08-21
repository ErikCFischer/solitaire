import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props) {
	return (
		<div className = {props.suit + " card"} onClick={props.onClick}>
			{props.face}
		</div>
	);
}

class Stock extends React.Component {
	render() {
		let ddout;
		if(this.props.cards.length) {
			ddout = <Card suit="facedown" onClick={() => this.props.onClick()} />;
		} else {
			ddout = <Card suit="white" face="?" onClick={() => this.props.onClick()} />;
		}
		return (
			<div>{ddout}</div>
		);
	}
}

class Heap extends React.Component {

	renderCards(i) {
		return (
			<Card
				suit={this.props.cards[i].suit + " hasright"}
				face={this.props.cards[i].face}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		let l = this.props.cards.length;
		if(l == 0) {
			return null;
		}
		let ddout = Array(0);
		for(let i = l-3; i < l; i++) {
			ddout.push(this.renderCards(i));
		}
		return (
			<div>
				{ddout}
			</div>
		);
	}
}

class Foundation extends React.Component {
	render() {
		let ddout = this.props.cards.map( item => <Card suit={item[2] ? item[1] : "facedown"} face={item[0]} /> );
		return (
			<div>{ddout}</div>
		);
	}
}

class Pile extends React.Component {

	renderCards(i) {
		return (
			<Card
				suit={this.props.cards[i].up ? this.props.cards[i].suit + " hasdown" : "facedown hasdown"}
				face={this.props.cards[i].up ? this.props.cards[i].face : ""}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		let l = this.props.cards.length;
		let ddout = Array(l);
		for(let i = 0; i < l; i++) {
			ddout[i] = this.renderCards(i);
		}
		return (
			<div>
				{ddout}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		let deck = Array(52);

		for(let s = 0; s < 4; s++) {
			for(let f = 0; f < 13; f++) {
				let i = f + s*13;

				deck[i] = {
					face: null,
					suit: null,
					up: false,
				};

				switch(f) {
					case 0:
						deck[i].face = 'A';
						break;
					case 10:
						deck[i].face = 'J';
						break;
					case 11:
						deck[i].face = 'Q';
						break;
					case 12:
						deck[i].face = 'K';
						break;
					default:
						deck[i].face = f+1;
						break;
				}
				switch(s) {
					case 0:
						deck[i].suit = 'liteRed';
						break;
					case 1:
						deck[i].suit = 'darkRed';
						break;
					case 2:
						deck[i].suit = 'liteBlue';
						break;
					case 3:
						deck[i].suit = 'darkBlue';
						break;
				}
			}
		}

		const fillPile = (pile) => {
			for(let i = 0; i < pile.length; i++) {
				let pick = Math.floor(Math.random() * deck.length);
				pile[i] = deck[pick];
				deck.splice(pick,1);
			}
			pile[pile.length-1].up = true;
		};

		let pile = Array(7);
		for(let i = 0; i < pile.length; i++) {
			pile[i] = Array(i+1);
			fillPile(pile[i]);
		}

		let stock = Array(24);
		fillPile(stock);
		
		this.state = {
			stock: stock,
			heap: Array(0),
			foundation: Array(4).fill(Array(0)),
			pile: pile,
			selected: null,
		};
	}

	stockClick() {
		let stock = this.state.stock;
		let heap = this.state.heap;

		if(stock.length != 0) {

			heap.push(stock.pop());
			heap.push(stock.pop());
			heap.push(stock.pop());
			if(heap[heap.length-1] == undefined) {
				if(heap[heap.length-2] == undefined) {
					heap[heap.length-3].up = true;
				} else {
					heap[heap.length-2].up = true;
					heap[heap.length-3].up = false;
				}
			} else {
				heap[heap.length-1].up = true;
				heap[heap.length-2].up = false;
				heap[heap.length-3].up = false;
			}


		} else {
			for(let i = heap.length; i > 0; i--) {
				let h = heap.pop();
				if(h != undefined) {
					stock.push(h);
				}
			}
		}

		this.setState({
			stock: stock,
			heap: heap,
			foundation: this.state.foundation,
			pile: this.state.pile,
			selected: this.state.selected,
		});
	}

	heapClick(i) {
		let heap = this.state.heap;
		let selected = this.state.selected;

		if(selected == null && heap[i].up) {
			selected = {
				section: "heap",
				index: i,
			};
			heap[i].suit += " selected";
		} else if (heap[i].suit.slice(-9) == " selected") {
			selected = null;
			heap[i].suit = heap[i].suit.slice(0,-9);
		}

		this.setState({
			stock: this.state.stock,
			heap: heap,
			foundation: this.state.foundation,
			pile: this.state.pile,
			selected: selected,
		});
	}

	foundationClick(f, i) {
		let foundation = this.state.foundation;
		let selected = this.state.selected;

		if(selected == null && foundation[f] != null) {
			selected = {
				section: "foundation",
				foundation: f,
				index: i,
			};
			foundation[f][i].suit += " selected";
		} else if (foundation[f][i].suit.slice(-9) == " selected") {
			selected = null;
			foundation[f][i].suit = foundation[f][i].suit.slice(0,-9);
		} else {
			switch(selected.section) {
				case "heap":
					break;
				case "foundation":
					break;
				case "pile":
					break;
			}
		}

		this.setState({
			stock: this.state.stock,
			heap: this.state.heap,
			foundation: foundation,
			pile: this.state.pile,
			selected: selected,
		});
	}

	pileClick(p, i) {
		let pile = this.state.pile;
		let selected = this.state.selected;

		if(selected == null && pile[p][i].up) {
			selected = {
				section: "pile",
				pile: p,
				index: i,
			};
			pile[p][i].suit += " selected";
		} else if (pile[p][i].suit.slice(-9) == " selected") {
			selected = null;
			pile[p][i].suit = pile[p][i].suit.slice(0,-9);
		} else {
			switch(selected.section) {
				case "heap":
					break;
				case "foundation":
					break;
				case "pile":
					break;
			}
		}

		this.setState({
			stock: this.state.stock,
			heap: this.state.heap,
			foundation: this.state.foundation,
			pile: pile,
			selected: selected,
		});
	}

	render() {
		return (
			<table border='1' cellSpacing='10'>
				<tr>
					<td>
						<Stock cards={this.state.stock} onClick={() => this.stockClick()} />
					</td>
					<td colSpan='2'>
						<Heap cards={this.state.heap} onClick={i => this.heapClick(i)} />
					</td>
					<td className="liteRed">
						<Foundation cards={this.state.foundation[0]} onClick={i => this.foundationClick(0,i)} />
					</td>
					<td className="darkRed">
						<Foundation cards={this.state.foundation[1]} onClick={i => this.foundationClick(1,i)} />
					</td>
					<td className="liteBlue">
						<Foundation cards={this.state.foundation[2]} onClick={i => this.foundationClick(2,i)} />
					</td>
					<td className="darkBlue">
						<Foundation cards={this.state.foundation[3]} onClick={i => this.foundationClick(3,i)} />
					</td>
				</tr>
				<tr>
					<td>
						<Pile cards={this.state.pile[0]} onClick={i => this.pileClick(0,i)} />
					</td>
					<td>
						<Pile cards={this.state.pile[1]} onClick={i => this.pileClick(1,i)} />
					</td>
					<td>
						<Pile cards={this.state.pile[2]} onClick={i => this.pileClick(2,i)} />
					</td>
					<td>
						<Pile cards={this.state.pile[3]} onClick={i => this.pileClick(3,i)} />
					</td>
					<td>
						<Pile cards={this.state.pile[4]} onClick={i => this.pileClick(4,i)} />
					</td>
					<td>
						<Pile cards={this.state.pile[5]} onClick={i => this.pileClick(5,i)} />
					</td>
					<td>
						<Pile cards={this.state.pile[6]} onClick={i => this.pileClick(6,i)} />
					</td>
				</tr>
			</table>
		);
	}
}



ReactDOM.render(
	<Game />,
	document.getElementById('root')
);