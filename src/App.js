import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye, faPlus, faImage } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


class App extends Component {
  state = {
    data: [],
    property: [],
    modalInsertar: false,
    modalNotificaion: false,
    modalPropiedades: false,
    modalModPrecio: false,
    form: {
      Name: '',
      Address: '',
      Price: '',
      CodeInternal: '',
      Year: '',
      IdOwner: '',
      NameOwner: '',
    },
    form2: {
      IdProperty: '',
      Name: '',
      Price: '',
    }
  }

  //Metodo para listar propietarios
  ListarPropietarios = () => {
    const url = "https://localhost:44331/api/Owner/ListarPropietarios";
    axios.get(url).then(response => {
      console.log(response.data)
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  //Metodo para listar propiedades
  ListarPropiedades = (IdOwner) => {
    const url = "https://localhost:44331/api/Property/ListarPropiedades/?idOwner=" + IdOwner;
    axios.get(url).then(response => {
      console.log(response.data)
      this.setState({ property: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  //Metodo para mostrar/ocultar modal de insertar propiedad
  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  //Metodo para mostrar/ocultar modal de notificacion
  modalNotificaion = () => {
    this.setState({ modalNotificaion: !this.state.modalNotificaion });
  }

  //Metodo para mostrar/ocultar modal listado de propiedades
  modalPropiedades = () => {
    this.setState({ modalPropiedades: !this.state.modalPropiedades });
  }

  //Metodo para mostrar/ocultar modal de modificar precio
  modalModPrecio = () => {
    this.setState({ modalModPrecio: !this.state.modalModPrecio });
  }

  //Propietario Seleccioando
  SeleccionarPropietario = (owner) => {
    this.setState({
      form: {
        IdOwner: owner.IdOwner,
        NameOwner: owner.NameOwner
      }
    })
  }

  //Propiedad Seleccioanda
  SeleccionPropiedad = (property) => {
    this.setState({
      form2: {
        IdProperty: property.IdProperty,
        Name: property.Name
      }
    })
  }


  //Capturar Informacion del formulario Add Properties
  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

   //Capturar Informacion del formulario Actualizar Precio
   handleChange1 = async e => {
    e.persist();
    await this.setState({
      form2: {
        ...this.state.form2,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  //Metodo para Insertar Propiedad
  InsertarPropiedad = async () => {
    //Elimino campos del request generado
    delete this.state.form.NameOwner;
    //EndPoint
    const urlInsertProperties = 'https://localhost:44331/api/Property/InsertarPropiedad'
    await axios.post(urlInsertProperties, this.state.form).then(response => {
      this.modalInsertar();
      this.modalNotificaion();
    }).catch(error => {
      console.log(error.message);
    })
  }

  //Metodo para Actualizar el Precio
  UpdatePriceProperty = () => {
    //Elimino campos del request generado
    delete this.state.form2.Name;
    const urlUpdatePrice = 'https://localhost:44331/api/Property/ActualizarPrecio'
    axios.put(urlUpdatePrice, this.state.form2).then(response => {
      this.modalModPrecio();   
      this.modalPropiedades();
      this.modalNotificaion();  
    })
  }

  //Ciclo de vida 
  componentDidMount() {
    this.ListarPropietarios();
  }


  render() {
    const { form } = this.state;
    const { form2 } = this.state;
    return (
      <div className="App">
        <br /><br />
        <h1 className='text-left h1 text-primary'>Owners List</h1>
        <br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Birthday</th>
              <th>Actions Properties</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(owner => {
              return (
                <tr>
                  <td key={owner.IdOwner}>{owner.IdOwner}</td>
                  <td>{owner.NameOwner}</td>
                  <td>{owner.Address}</td>
                  <td>{owner.Birthday}</td>
                  <td>
                    <button className="btn btn-success ml-5" title='View Properties' onClick={() => { this.SeleccionarPropietario(owner); this.modalPropiedades(); this.ListarPropiedades(owner.IdOwner) }} ><FontAwesomeIcon icon={faEye} /></button>
                    <span style={{ paddingLeft: '4px' }}></span>
                    <button className="btn btn-primary" title='Add Properties' onClick={() => { this.SeleccionarPropietario(owner); this.modalInsertar() }} ><FontAwesomeIcon icon={faPlus} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Modal para capturar informacion de una nueva propiedad */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            Add Properties
            <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className='col-md-4'>
                <label htmlFor="IdOwner">Id Owner:</label>
                <input className="form-control" type="text" name="IdOwner" id="IdOwner" readOnly onChange={this.handleChange} value={form ? form.IdOwner : ''} />
              </div>
              <div className='col-md-8'>
                <label htmlFor="NameOwner">Name Owner:</label>
                <input className="form-control" type="text" name="NameOwner" id="NameOwner" required readOnly onChange={this.handleChange} value={form ? form.NameOwner : ''} />
              </div>
              <div className='col-md-12'>
                <hr></hr>
              </div>
              <div className='col-md-4'>
                <label htmlFor="Name">Name:</label>
                <input className="form-control" autoComplete='off' type="text" name="Name" id="Name" onChange={this.handleChange} value={form.Name} />
              </div>
              <div className='col-md-8'>
                <label htmlFor="Address">Address:</label>
                <input className="form-control" autoComplete='off' type="text" name="Address" id="Address" onChange={this.handleChange} value={form.Address} />
              </div>
              <div className='col-md-4'>
                <label htmlFor="Price">Price:</label>
                <input className="form-control" autoComplete='off' type="number" name="Price" id="Price" onChange={this.handleChange} value={form.Price} />
              </div>
              <div className='col-md-4'>
                <label htmlFor="CodeInternal">Code Internal:</label>
                <input className="form-control" autoComplete='off' type="text" name="CodeInternal" id="CodeInternal" onChange={this.handleChange} value={form.CodeInternal} />
              </div>
              <div className='col-md-4'>
                <label htmlFor="Year">Year:</label>
                <input className="form-control" autoComplete='off' type="number" name="Year" id="Year" onChange={this.handleChange} value={form.Year} />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='text-center'>
            <button className="btn btn-success" onClick={() => this.InsertarPropiedad()}>Insert</button>
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancel</button>
          </ModalFooter>
        </Modal>



        {/* Modal Vista de Propiedades*/}
        <Modal isOpen={this.state.modalPropiedades} className="modal-dialog modal-xl">
          <ModalHeader style={{ display: 'block' }}>
            <span className='text-left h4 text-danger'> Property of {form.NameOwner} </span>
            <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.modalPropiedades()}>x</span>
          </ModalHeader>
          <ModalBody>
            <table className="table ">
              <thead>
                <tr>
                  <th>IdProperty</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Price</th>
                  <th>CodeInternal</th>
                  <th>Year</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {this.state.property.map(property => {
                  return (
                    <tr>
                      <td key={property.IdProperty}>{property.IdProperty}</td>
                      <td>{property.Name}</td>
                      <td>{property.Address}</td>
                      <td>{property.Price}</td>
                      <td>{property.CodeInternal}</td>
                      <td>{property.Year}</td>
                      <td>
                        <button className="btn btn-success ml-5" title='Upload image'><FontAwesomeIcon icon={faImage} /></button>
                        <span style={{ paddingLeft: '4px' }}></span>
                        <button className="btn btn-primary" title='modify price' onClick={() => { this.modalModPrecio(); this.SeleccionPropiedad(property) }}><FontAwesomeIcon icon={faEdit} /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Modal Modificar Precio Propiedad*/}
            <Modal isOpen={this.state.modalModPrecio}>
              <ModalHeader style={{ display: 'block' }}>
                Update Price
                <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.modalModPrecio()}>x</span>
              </ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className='col-md-2'>
                    <label htmlFor="IdProperty">Id:</label>
                    <input className="form-control" type="text" name="IdProperty" id="IdProperty" readOnly onChange={this.handleChange1} value={form2 ? form2.IdProperty : ''} />
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor="Name">Name:</label>
                    <input className="form-control" type="text" name="Name" id="Name" readOnly onChange={this.handleChange1} value={form2 ? form2.Name : ''} />
                  </div>
                  <div className='col-md-4'>
                    <label htmlFor="Price">Price:</label>
                    <input className="form-control" type="text" name="Price" id="Price" onChange={this.handleChange1} />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-success" onClick={() => { this.UpdatePriceProperty(); }}>Update</button>
                <button className="btn btn-danger" onClick={() => this.modalModPrecio()}>Cancel</button>
              </ModalFooter>
            </Modal>

          </ModalBody>
          <ModalFooter className='text-center'>
            <button className="btn btn-danger" onClick={() => this.modalPropiedades()}>Return</button>
          </ModalFooter>
        </Modal>



        {/* Modal De Registro Exitoso*/}
        <Modal isOpen={this.state.modalNotificaion}>
          <ModalHeader style={{ display: 'block' }}>
            Notification!
            <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.modalNotificaion()}>x</span>
          </ModalHeader>
          <ModalBody>
            Successful registration!
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.modalNotificaion()}>Accept</button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}
export default App;
