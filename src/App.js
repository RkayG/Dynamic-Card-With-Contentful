import './App.css';
import React, { useState, useEffect } from 'react';
import { createClient } from 'contentful';

console.log(process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN);
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

function EventCard() {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'featuredEvent'
        });
        setEvent(response.items[0]?.fields);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchData();
  }, []);

  if (!event) return null;

  const { eventImage, eventHeading, eventEndDate } = event;
  const formattedDate = formatDate(eventEndDate);

  return (
    <div className='container'>
      <h1 className='section-title'>Featured Event</h1>
      <div className="event-card">
        <img className='event-image' src={eventImage?.fields?.file?.url} alt={eventHeading} />
        <h2 className='event-heading'>{eventHeading}</h2>
        <p className='event-end-date'> Ends: {formattedDate}</p>
      </div>
    </div>
  );
}

  // Helper function to format date
  function formatDate(dateString) {
    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

export default EventCard;