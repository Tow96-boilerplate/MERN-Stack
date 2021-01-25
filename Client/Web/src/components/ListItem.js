/** List.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 * 
 * Component for the items that are on a list
 */
import React from 'react';
import { Button, Card, Popup } from 'semantic-ui-react';

const ListItem = (props) => {

  // Callbacks
  function shareCallback() { if (props.share) props.share(props.id); };
  function editCallback() { if (props.edit) props.edit(props.id); };
  function fillCallback() { if (props.fill) props.fill(props.id); };
  function deleteCallback() { if (props.delete) props.delete(props.id); };

  return (
    <>
      <Card fluid>
        <Card.Content>
          <div className='list-item'>
            <div>
              {/* TODO: Picture when DB can handle it */}
              {/* Object name */}
              <h4>{props.children}</h4>
            </div>
            {/* Buttons */}
            <Button.Group size='tiny'>
              {props.fill && (
                <Popup content='Fill' trigger={<Button onClick={fillCallback} icon='check square' />} />
              )}
              {props.edit && (
                <Popup content='Edit' trigger={<Button onClick={editCallback} icon='edit' />} />
              )}
              {props.share && (
                <Popup content='Share' trigger={<Button onClick={shareCallback} icon='share alternate' />} />
              )}
              {props.delete && (
                <Popup content='Delete' trigger={<Button negative onClick={deleteCallback} icon='trash alternate' />} />
              )}
            </Button.Group>
          </div>
        </Card.Content>
      </Card>
    </>
  )
}

export default ListItem;
