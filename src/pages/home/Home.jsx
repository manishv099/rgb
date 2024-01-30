import { useEffect } from 'react';
import './home.scss';
import { Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch';
import { getApiUrl } from '../../utils/apiConfig';

export const Home = () => {
    const test_api = useFetch();
    const test_api1 = useFetch();
    const test_api2 = useFetch();
    const testApi = getApiUrl('testApi');

    const formSubmit = async () => {
        const name = {"name":"set name"};
        const send_data = JSON.stringify(name);
        await test_api.postRequest('https://api.rgbplay.in/test',name);
        // await test_api1.getRequest('https://api.rgbplay.in/test');
        await test_api2.getRequest('https://api.rgbplay.in/user/v1/get_game_details');
        console.log('response api post',test_api.data);   
        console.log('response api get',test_api2.data);   
    };  

    const testingFunction = async () => {
        const name = {"name":"set name"};
        // const send_data = JSON.stringify(name);
        fetch('https://api.rgbplay.in/test', {
                method: "POST", 
                body: JSON.stringify(name),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                } 
            }
        ).then(response => response.json())
        .then(data => {
            console.log('then data',data)
        })
        .catch((err) => {
            console.log('error data',err);
        });
    }

    const navigate = useNavigate();
    const token = localStorage.getItem('email_or_phone');
    useEffect(()=>{
        // testingFunction();
        formSubmit();  
        if(token){
            navigate('/dashboard');
        }
    },[]);
    return (
        <>
            <Container>
                <div className='home_content'>
                    {/* <h1>Play to Win more money</h1> */}
                    <p><b>What is RGB (red, green and blue)?</b>
RGB (red, green and blue) refers to a system representing the colors used on a digital display screen. Red, green and blue can be combined in various proportions to obtain any color in the visible spectrum.<p></p>

The RGB model uses 8 bits each -- from 0 to 23 -- for red, green and blue colors. Each color also has values ranging from 0 to 255. This translates into millions of colors -- 16,777,216 possible colors to be precise.<p></p>

<b>What is RGB used for?</b>
This color space is a color representation method used in electronic displays, like televisions, computer monitors, digital cameras and various types of lighting. Before the electronic age, there was no such thing as an electronic display, so the RGB color model didn't exist.<p></p>

To create a color model, scientists needed a way to represent colors electronically. They came up with three components: red, green and blue. These components were chosen because humans could see them easily<p></p>

<b>What is an RGB signal?</b><br></br>
An RGB signal is a video signal representing the television's primary colors -- red, green and blue. Often called a component video signal, RGB signals are divided into their component colors.<p></p>

<b>What is the RGB range?</b><br></br>
Each component can take any value between 0 (black) and 1 (white). For example, if each component takes a value between 0 and 1, the total range of possible colors is 0 to 255. When these three numbers are added together, the resulting number represents the light's intensity.<p></p>

Each R, G and B level can range from 0% to 100% full intensity. Each level is represented by the range of decimal numbers from 0 to 255 -- 256 levels for each color -- equivalent to the range of binary numbers from 00000000 to 11111111 or hexadecimal 00 to FF. The total number of available colors is 256 x 256 x 256 or 16,777,216<p></p>

<b>Can we use RGB in HTML?</b><br></br>
In Hypertext Markup Language (HTML), we can specify colors using RGB; hue, saturation, lightness; HSLA, which is an extension of HSL with an Alpha channel (opacity); RGBA, which is RGB with an Alpha channel; and Hex values. Hex values are now the industry standard. To display the colors for all possible values, the computer display system must have 24 bits to describe the color in each pixel. An approximation of the specified color is displayed in display systems or modes with fewer bits for displaying colors<p></p>

<b>What is RGB lighting?</b><p></p>

RGB lighting creates a wide variety of colors that range from warm orange to cool blue. RGB lighting technology is often used in RGB light-emitting diode strips -- for example, triple diode Classic LED strips.<p></p>

*The capability to deliver stunning colors is a benefit of today's computers and other electronic systems, but eye strain has become a workplace health issue.<p></p>

Blue light from screens can create fatigue and disrupt sleep. Employees can combat this by wearing special glasses or using free programs to adjust computer screen lighting. Digital wellness, encompassing eye strain and other workplace health issues, has become an important consideration in a positive employee experience.Screen colors and health issues*<p></p></p>
                </div>
            </Container>
            <div className='btm_link'>
                <div className='d-flex'>
                    <div className='mx-1'><Link to="/" className='btn btn-primary'>Home</Link></div>
                    <div className='mx-1'><Link to="signin" className='btn btn-success'>Play</Link></div>
                </div>
            </div>
        </>
    )
}
