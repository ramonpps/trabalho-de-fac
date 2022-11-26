import React, { useState } from 'react';
import './App.css';

export default function Dashboard() {


  return (
          <center className='formbox'>
            <h1>New Registry</h1>
            <h2>Personal info</h2>
            <form className='form'>
              <div className='formitem'>
                  <label for="SeuNome">Your name:</label>
                  <input className='formitem' type="text" id="SeuNome" placeholder='Your name'/>
              </div>
              <div className='formitem'>
                  <label for="email">Your E-mail:</label>
                  <input className='formitem' type="email" id="email" placeholder='Your email'/>
              </div>
              <div className='formitem'>
                  <label for="NomeRua">Street Address:</label>
                  <input className='formitem' type="text" id="NomeRua" placeholder='Street Address'/>
              </div>
              <br></br>
              <h2>Please, submit your personal rating about this street<br></br>Your grade will be considered by our algorithm to determine final results</h2>

              <div className='formitem'>
              <fieldset>
                <legend><h4>Infrastructure</h4></legend>
                <h3>How do you feel about this street Infrastructure? Is it easy to walk by both feet and vehicles?</h3>
                <p className='radioflexbox'>
                  <div>
                    <input type="radio" name="infra" id="infra_1" value="small" />
                    <label for="infra_1"><b>Upset</b></label>
                  </div>
                  <div>
                    <input type="radio" name="infra" id="infra_2" value="medium" />
                    <label for="infra_2"><b>Bad</b></label>
                  </div>
                  <div>
                    <input type="radio" name="infra" id="infra_3" value="large" />
                    <label for="infra_3"><b>Neutral</b></label>
                  </div>
                  <div>
                    <input type="radio" name="infra" id="infra_4" value="large" />
                    <label for="infra_4"><b>Good</b></label>
                  </div>
                  <div>
                    <input type="radio" name="infra" id="infra_5" value="large" />
                    <label for="infra_5"><b>Awesome</b></label>
                  </div>
                </p>
                <div className='formitem'>
                    <label for="NomeRua">Observations: </label>
                    <input className='formitem' type="text" id="infrastructure_observations" placeholder='Type something...' />
                </div>
              </fieldset>
              </div>

              <div className='formitem'>
              <fieldset>
                <legend><h4>Accessibility</h4></legend>
                <h3>How do you feel about this street Accessibility? Is it friendly to mobility restricted people?</h3>
                <p className='radioflexbox'>
                  <div>
                    <input type="radio" name="access" id="access_1" value="small" />
                    <label for="access_1"><b>Upset</b></label>
                  </div>
                  <div>
                    <input type="radio" name="access" id="access_2" value="medium" />
                    <label for="access_2"><b>Bad</b></label>
                  </div>
                  <div>
                    <input type="radio" name="access" id="access_3" value="large" />
                    <label for="access_3"><b>Neutral</b></label>
                  </div>
                  <div>
                    <input type="radio" name="access" id="access_4" value="large" />
                    <label for="access_4"><b>Good</b></label>
                  </div>
                  <div>
                    <input type="radio" name="access" id="access_5" value="large" />
                    <label for="access_5"><b>Awesome</b></label>
                  </div>
                </p>
                <div className='formitem'>
                    <label for="NomeRua">Observations: </label>
                    <input className='formitem' type="text" id="accessibility_observations" placeholder='Type something...'/>
                </div>
              </fieldset>
              </div>

              <div className='formitem'>
              <fieldset>
                <legend><h4>Car Traffic</h4></legend>
                <h3>How do you feel about this street Car Traffic? How often does its traffic gets jammed and accidents happen?</h3>
                <p className='radioflexbox'>
                  <div>
                    <input type="radio" name="traffic" id="traffic_1" value="small" />
                    <label for="traffic_1"><b>Upset</b></label>
                  </div>
                  <div>
                    <input type="radio" name="traffic" id="traffic_2" value="medium" />
                    <label for="traffic_2"><b>Bad</b></label>
                  </div>
                  <div>
                    <input type="radio" name="traffic" id="traffic_3" value="large" />
                    <label for="traffic_3"><b>Neutral</b></label>
                  </div>
                  <div>
                    <input type="radio" name="traffic" id="traffic_4" value="large" />
                    <label for="traffic_4"><b>Good</b></label>
                  </div>
                  <div>
                    <input type="radio" name="traffic" id="traffic_5" value="large" />
                    <label for="traffic_5"><b>Awesome</b></label>
                  </div>
                </p>
                <div className='formitem'>
                    <label for="NomeRua">Observations: </label>
                    <input className='formitem' type="text" id="traffic_observations" placeholder='Type something...'/>
                </div>
              </fieldset>
              </div>

              <div className='formitem'>
              <fieldset>
                <legend><h4>Sanitation</h4></legend>
                <h3>How do you feel about this street Sanitation? Does it get cleaned regulary and its pest control is sactisfatory?</h3>
                <p className='radioflexbox'>
                  <div>
                    <input type="radio" name="sanitation" id="sanitation_1" value="small" />
                    <label for="sanitation_1"><b>Upset</b></label>
                  </div>
                  <div>
                    <input type="radio" name="size" id="sanitation_2" value="medium" />
                    <label for="sanitation_2"><b>Bad</b></label>
                  </div>
                  <div>
                    <input type="radio" name="size" id="sanitation_3" value="large" />
                    <label for="sanitation_3"><b>Neutral</b></label>
                  </div>
                  <div>
                    <input type="radio" name="size" id="sanitation_4" value="large" />
                    <label for="sanitation_4"><b>Good</b></label>
                  </div>
                  <div>
                    <input type="radio" name="size" id="sanitation_5" value="large" />
                    <label for="sanitation_5"><b>Awesome</b></label>
                  </div>
                </p>
                <div className='formitem'>
                    <label for="NomeRua">Observations: </label>
                    <input className='formitem' type="text" id="sanitation_observations" placeholder='Type something...'/>
                </div>
              </fieldset>
              </div>

              <div className='formitem'>
              <fieldset>
                <legend><h4>Security</h4></legend>
                <h3>How do you feel about this street Security? It has enough working lightpoles, police patrols? </h3>
                <p className='radioflexbox'>
                  <div>
                    <input type="radio" name="security" id="security_1" value="small" />
                    <label for="security_1"><b>Upset</b></label>
                  </div>
                  <div>
                    <input type="radio" name="security" id="security_2" value="medium" />
                    <label for="security_2"><b>Bad</b></label>
                  </div>
                  <div>
                    <input type="radio" name="security" id="security_3" value="large" />
                    <label for="security_3"><b>Neutral</b></label>
                  </div>
                  <div>
                    <input type="radio" name="security" id="security_4" value="large" />
                    <label for="security_4"><b>Good</b></label>
                  </div>
                  <div>
                    <input type="radio" name="security" id="security_5" value="large" />
                    <label for="security_5"><b>Awesome</b></label>
                  </div>
                </p>
                <div className='formitem'>
                    <label for="NomeRua">Observations: </label>
                    <input className='formitem' type="text" id="security_observations" placeholder='Type something...'/>
                </div>
              </fieldset>
              </div>

              <div className='formitem'>
              <fieldset>
                <legend><h4>File</h4></legend>
                <h3>Please, upload a image or video file with the problems you encountered so we can analyze it </h3>
                <label className='formitem' for="avatar">Choose a file:</label>

                <input type="file" id="avatar" name="avatar" accept="image/*, video/*"></input>
              </fieldset>
              </div>

              <br></br>

              <div class="button">
                <button type="reset" onClick={() => {alert('Avaliation registered successfully! Press "OK" to close.')}}>Submit</button>
              </div>
              <br></br>
            </form>
          </center>
  );
}
