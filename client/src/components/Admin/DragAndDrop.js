import React, { Component } from "react";
import { DragBar } from './Shared/DragBar';
import Button from "@material-ui/core/Button";
import FormFieldEditor from './FormFieldEditor';

import "./drag.css";

class DragAndDrop extends Component {
    state = {
        items: ["Computer", "Phone", "Other", "Notelink","Computers", "Phones", "Others", "Notes"],
        formEditorOpen: false,
    };

    onDragStart = (e, index) => {
        this.draggedItem = this.state.items[index];
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    };

    onDragOver = index => {
        const draggedOverItem = this.state.items[index];

        // if the item is dragged over itself, ignore
        if (this.draggedItem === draggedOverItem) {
            return;
        }

        // filter out the currently dragged item
        let items = this.state.items.filter(item => item !== this.draggedItem);

        // add the dragged item after the dragged over item
        items.splice(index, 0, this.draggedItem);

        this.setState({ items });
    };

    onDragEnd = () => {
        this.draggedIdx = null;
    };

    setSelect = (idx, newName) => {
        console.log('IDX', idx, newName);

        const { items } = this.state;
        items[idx] = newName;

        this.setState({items});

        //
        // this.setState(prevState => ({
        //     items: {
        //         ...prevState.items,
        //         [prevState.items[idx]]: newName,
        //     },
        // }));
    };

    handleClickOpen = () => {
        this.setState({formEditorOpen: true});
    };

    handleClickClose = () => {
        this.setState({formEditorOpen: false});
    };

    render() {
        console.table(this.state.items);
        const {formEditorOpen} = this.state;
        return (
         <React.Fragment>
            <div className="App">
                <main>
                    <ul>
                        {Array.isArray(this.state.items) && this.state.items.map((item, idx) => (
                            <li key={item} onDragOver={() => this.onDragOver(idx)}>
                                <div
                                    className="drag"
                                    draggable
                                    onDragStart={e => this.onDragStart(e, idx)}
                                    onDragEnd={this.onDragEnd}
                                >
                                    <DragBar itemName={item} idx={idx} setSelect={this.setSelect}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
            <FormFieldEditor handleClickClose={this.handleClickClose} formEditorOpen={formEditorOpen}/>
             <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>
                 Open dialog
             </Button>
         </React.Fragment>
        );
    }
}

export default (DragAndDrop);
