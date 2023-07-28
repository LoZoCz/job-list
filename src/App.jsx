import '../dist/index-e117c614.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import Data from "./json/data.json"
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

function App () {
  const { ludzie, miejsca } = Data;
  const [formVisibility, setFormVisibility] = useState(false);
  const [ pplJobs, setPplJobs ] = useState( () => {
    const initialJobs = miejsca.reduce((acc, item) => {
      acc[item.nazwa] = [];
      return acc;
    }, {} );
    
    const localData = localStorage.getItem( 'PplJobsData' )
    
    return localData == null ? initialJobs : JSON.parse(localData)
  });
  
  useEffect(() => {
    localStorage.setItem('PplJobsData', JSON.stringify(pplJobs));
  }, [pplJobs]);

  const [ formData, setFormData ] = useState( {
    id: '',
    place: '',
    person: '',
    date: '',
    quantity: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Pobierz dane z formularza
    const { place, person, date, quantity } = formData;

    if (!place || !person || !date || !quantity) {
    // Handle form validation error here
      return;
    }

    const startDate = dayjs(date).format('DD/MM/YYYY');
    const endDate = dayjs(date).add(quantity, 'days');
    const dateRange = `${startDate} - ${dayjs(endDate).format('DD/MM/YYYY')}`;

    // Dodaj nową osobę do odpowiedniej tablicy w stanie pplJobs
    setPplJobs((prevJobs) => ({
      ...prevJobs,
      [place]: [
        ...prevJobs[place],
        {
          id: crypto.randomUUID(),
          osoba: person,
          data: dateRange,
        },
      ],
    }));

    // Zresetuj formularz
    setFormData({
      place: '',
      person: '',
      date: '',
      quantity: '',
    });

    // Ukryj formularz
    setFormVisibility( false );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
const deleteJob = (id, place) => {
  setPplJobs((prevJobs) => ({
    ...prevJobs,
    [place]: prevJobs[place].filter((person) => person.id !== id)
  }));
};
  
  useEffect( () => {
    console.log( pplJobs )
  }, [pplJobs] )

  return (
    <>
      <header className='main-head'>
        <div className="header-text">
          <h1>Kraft 24 / 7</h1>
        </div>
        <button className='add-btn' onClick={() => setFormVisibility(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </header>

      <main className='main-cont'>
        <aside className="menu-wrapper">
          <ul className="options-list">
            {ludzie.map( item => {
              return (
                <li className='option' key={item.id + ' ' + item.nazwisko}>
                  {item.imie} {item.nazwisko}
                </li>
              )
            })}
          </ul>
        </aside>
        <section className='tabel-wrapper'>
          {miejsca.map(item => {
            return (
              <div className="col-wrapper" key={item.id}>
                <h3 className="col-name">{item.nazwa}</h3>
                <div className="column">
                  {pplJobs[item.nazwa].map((person) => {
                    return (
                      <div className="job" key={person.id}>
                        <div>
                          <p>{person.osoba}</p>
                          <p>{person.data}</p>
                        </div>
                        <button className='del-btn' onClick={() => deleteJob(person.id, item.nazwa)}>
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>
      </main>
      {formVisibility && (
        <div className="backdrop" data-visible={formVisibility}>
          <form className='add-form' method='post' action=' ' onSubmit={handleFormSubmit}>
            <select
              className='place-select'
              name="place"
              value={formData.place}
              onChange={handleInputChange}
            >
              <option value="">Wybierz miejsce</option>
              {miejsca.map(item => {
                return <option key={item.id} value={item.nazwa}>{item.nazwa}</option>
              })}
            </select>
            <select
              className='ppl-select'
              name="person"
              value={formData.person}
              onChange={handleInputChange}
            >
              <option value="">Wybierz osobę</option>
              {ludzie.map(item => {
                return <option key={item.id} value={item.imie + ' ' + item.nazwisko}>{item.imie} {item.nazwisko}</option>
              })}
            </select>
            <input
              type="date"
              className="date-inp"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
            <input type="text" className="days-inp" placeholder='Podaj ilość dni w przód' name="quantity" value={formData.quantity} onChange={handleInputChange}/>
            <div className="btn-box">
              <button type='submit' className='sub-btn'>Dodaj</button>
              <button type='button' className='close-btn' onClick={() => setFormVisibility(false)}>Anuluj</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default App
