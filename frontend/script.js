window.addEventListener("load", function () {
    const page = window.location.pathname.substring(1);
    const rootElement = document.getElementById("root");

    let userNames = [];
    let emails = [];

    const decodeToken = (token) => {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const token = localStorage.getItem('token');
    const userInfo = document.querySelector('.user-info');
    if (token) {
        // If user is logged in, replace "Sign Up" and "Log In" buttons with "Log Out" button
        userInfo.innerHTML = `<button id="logoutButton">Log Out</button>`;
        document.getElementById('logoutButton').addEventListener('click', () => {
            // Remove token from local storage on logout
            localStorage.removeItem('token');
            // Redirect user to the home page or any other appropriate page
            window.location.href = '/home';
        });
    } else {
        // If user is not logged in, display "Sign Up" and "Log In" buttons
        userInfo.innerHTML = `
            <button><a href="/createaccount">Sign Up</a></button>
            <button><a href="/login">Log In</a></button>
        `;
    }
    

    // Add event listener to redirect to home page when logo or "The Arts Club" text is clicked
    const logo = document.querySelector('.logo');
    const artsClubText = document.querySelector('.logo h1');

    logo.addEventListener('click', () => {
        window.location.href = '/home';
    });

    artsClubText.addEventListener('click', () => {
        window.location.href = '/home';
    });

    if (page === "home") {
        // Display the banner and "A Glimpse of Art" section
        rootElement.innerHTML = `
            <div class="banner" style="text-align: center; margin-bottom: 20px; position: relative;">
                <img src="https://img.pikbest.com/origin/09/33/25/21ypIkbEsT9iM.jpg!w700wp" alt="Art Club Banner" style="width: 100%; height: auto; border-radius: 8px;">
                <h2 style="font-size: 24px; color: #ffd700; margin-top: 10px; position: absolute; width: 100%; top: 101%; left: 50%; transform: translate(-50%, -50%);">Where art meets excellence and excellence meets you</h2>
            </div>
            <div class="glimpse-of-art">
                <h2>A Glimpse of Art</h2>
                <p>Embark on a journey through the ethereal realms of creativity with 'A Glimpse of Art,' where each brushstroke is a whispered tale, and every canvas a window to boundless imagination. Explore a curated selection of masterpieces that transcend time, beckoning you into worlds where colors dance, emotions bloom, and dreams take flight. Delve into the sublime fusion of beauty and expression, where artistry knows no bounds and inspiration knows no limits. Experience the enchantment, embrace the wonder, and immerse yourself in the transformative power of art.</p>
                <div class="art-preview" id="artPreviewContainer">
                    <!-- Art pieces will be dynamically added here -->
                </div>
                <button id="exploreMoreBtn">Explore More</button>
            </div>
        `;

        const artPreviewContainer = document.getElementById("artPreviewContainer");
        const exploreMoreBtn = document.getElementById("exploreMoreBtn");

        // Fetch data.json and select 3 random art pieces
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Shuffle the art data array
                const shuffledArtData = data.sort(() => Math.random() - 0.5);

                // Take the first 3 art pieces for display
                const randomArtPieces = shuffledArtData.slice(0, 3);

                // Display each art piece in the container
                randomArtPieces.forEach(artPiece => {
                    const artDiv = document.createElement("div");
                    artDiv.classList.add("art-preview-item");
                    artDiv.innerHTML = `
                        <img src="${artPiece.art_photo_url}" alt="${artPiece.name}" class="art-preview-image">
                        <p>${artPiece.name}</p>
                    `;
                    artPreviewContainer.appendChild(artDiv);
                });

                // Add event listener to the Explore More button
                exploreMoreBtn.addEventListener("click", function () {
                    window.location.href = "/gallery";
                });
            })
            .catch(error => {
                console.error('Error fetching art data:', error);
            });
    }
    else if (page === "about") {
        rootElement.innerHTML = `
            <h2>About Our Art Club</h2>
            <p>Welcome to The Arts Club, where creativity knows no bounds!</p>
            <h3>Our Mission</h3>
            <p>At The Arts Club, we believe that art is a universal language that brings people together. Our mission is to inspire, support, and nurture the artistic talents within our community. We strive to create a welcoming and inclusive environment where artists of all skill levels can flourish.</p>           
            <h3>Events and Gallery</h3>
            <p>On our site, you will be able to participate in events featuring diverse art objects, providing a hands-on experience with different forms and styles of art. Additionally, explore our vast art gallery, showcasing a wide range of artworks created by our talented members.</p>
            <h3>Our Community</h3>
            <p>Our club is more than just a place to create art; it's a vibrant community of like-minded individuals who share a passion for creativity. Whether you're a seasoned artist or just starting out, you'll find a supportive network of peers who are eager to share ideas, provide feedback, and collaborate on projects.</p>
            <h3>Why Join Us?</h3>
            <p><strong>Inspiration and Growth:</strong> Surround yourself with a diverse group of artists who can inspire and challenge you to grow.</p>
            <p><strong>Resources and Opportunities:</strong> Access to exclusive resources, materials, and opportunities to showcase your work.</p>
            <p><strong>Friendly Atmosphere:</strong> Enjoy a warm and friendly environment where your creativity can thrive.</p>
            <p>Join us at The Arts Club and be a part of a community where art comes alive. Let's create something amazing together!</p>
        `;
    }
    else if (page == "events") {
        console.log("Rendering events page"); // Add this line for debugging
         // Fetch events from the server
    fetch('/getevents')
    .then(response => {
        console.log('Response from server:', response);
        return response.json();
    })
        .then(events => {
            console.log('Fetched events:', events);
            // Render the fetched events
            const eventsContainer = document.querySelector('.events');
            events.forEach(event => {
                const eventElement = document.createElement('div');
                console.log(eventElement);
                eventElement.classList.add('event');

                const eventDate = new Date(event.date);
                const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
                const timeOptions = { hour: '2-digit', minute: '2-digit' };
                const formattedDate = eventDate.toLocaleDateString('en-GB', dateOptions);
                const formattedTime = eventDate.toLocaleTimeString('en-GB', timeOptions);
                const formattedDateTime = `Date: ${formattedDate} at ${formattedTime}`;

                eventElement.innerHTML = `
                    <img src="images/Health&Wellbeing.jpg">
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p class="event-date">${formattedDateTime}</p>
                        <p>Location: ${event.location}</p>
                        <p>Description: ${event.description}</p>
                        <button class="book-now">Book Now</button>
                    </div>
                `;
                eventsContainer.appendChild(eventElement);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            // Handle error
        });



        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeToken(token);
            console.log('Decoded token:', decodedToken);

            if (decodedToken && decodedToken.user.role === 'admin') {
                console.log('Admin role detected, rendering create event button');
                const createEventButton = document.createElement('button');
                createEventButton.textContent = 'Create Event';
                createEventButton.addEventListener('click', function () {
                    // Remove existing content from root element
                    rootElement.innerHTML = '';

                    // Create the form for creating events
                    const createEventForm = document.createElement('form');
                    createEventForm.id = 'createEventForm';

                    createEventForm.innerHTML = `
                        <h2>Create Event</h2>
                        <label>Event Name:</label>
                        <input type="text" id="eventName" required><br>
                        <label>Date:</label>
                        <input type="date" id="eventDate" required><br>
                        <label>Hour:</label>
                        <input type="time" id="eventHour" required><br>
                        <label>Location:</label>
                        <input type="text" id="eventLocation" required><br>
                        <label>Description:</label>
                        <textarea id="eventDescription" rows="4" cols="50" required></textarea><br>
                        <button type="submit">Create Event</button>
                    `;

                    // Append the form to the root element
                    rootElement.appendChild(createEventForm);

                    // Add event listener to the dynamically generated form
                    createEventForm.addEventListener('submit', function (event) {
                        console.log('Create event button clicked!'); // Add this line for debugging
                        event.preventDefault();

                        

                        // Get event data from the form
                        const eventData = {
                            title: createEventForm.elements.eventName.value,
                            date: createEventForm.elements.eventDate.value,
                            hour: createEventForm.elements.eventHour.value,
                            location: createEventForm.elements.eventLocation.value,
                            description: createEventForm.elements.eventDescription.value
                        };

                        // Send event data to the server for processing
                        fetch('/events', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(eventData),
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                console.log(data);
                                // Display success message or handle any errors
                               

                                // Redirect back to the events page
                                window.location.href = '/events';
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                // Display error message
                                message.textContent = "An error occurred. Please try again later.";
                            });
                    });
                });
                rootElement.appendChild(createEventButton);
            } else {
                console.log('User role is not admin');
            }
        } else {
            console.log('No token found in localStorage');
        }
    }
    else if (page === "members") {
        rootElement.innerHTML = `
<div class="container">
    <h2>Become a Member</h2>
    <p>Do you want to become a member of Our Art Club? Improving and helping the administration of our majestic website -> $100/month</p>
    <button id="becomeMemberBtn">Yes, I want to become a member</button>
    <div id="membershipDetails">
        <h3>Membership Packages</h3>
        <p>We offer various membership packages tailored to meet your needs:</p>
        <ul>
            <li>Basic Membership: Access to all online content and events</li>
            <li>Standard Membership: Additional access to exclusive workshops and exhibitions</li>
            <li>Premium Membership: All-inclusive access to workshops, exhibitions, and personalized artist support</li>
        </ul>
    </div>
</div>`

        const becomeMemberBtn = document.getElementById("becomeMemberBtn");
        becomeMemberBtn.addEventListener("click", function () {
            // You can implement logic here to handle the click event
            // For example, you can redirect the user to a registration page:
            window.location.href = "/payment";
        })
    }
    else if (page === "gallery") {
        rootElement.innerHTML = `
            <div class="header">
                <h2>Art Club Gallery</h2>
                <div>
                    <select id="searchCriteria" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; background-color: rgba(255, 255, 255, 0.2); color: black; margin-right: 10px;">
                        <option value="name">Name</option>
                        <option value="artist">Artist</option>
                    </select>
                    <input type="text" id="searchBar" placeholder="Search...">
                    <button id="searchBtn">Search</button>
                </div>
            </div>
            <div id="gallery" class="gallery"></div>
            <button id="loadMoreBtn">Load More</button>
            <div id="artDetails" class="art-details"></div>
        `;

        const galleryElement = document.getElementById("gallery");
        const loadMoreBtn = document.getElementById("loadMoreBtn");
        const searchBtn = document.getElementById("searchBtn");
        const searchBar = document.getElementById("searchBar");
        const searchCriteria = document.getElementById("searchCriteria");
        const artDetails = document.getElementById("artDetails");

        let filteredArtData = [];
        let currentPage = 1;
        const itemsPerPage = 10;
        const displayedIndices = new Set();

        function displayArt(data, append = false) {
            if (!append) galleryElement.innerHTML = "";
            data.forEach((artObject, index) => {
                const artDiv = document.createElement("div");
                artDiv.classList.add("art-object");
                artDiv.innerHTML = `
                    <img src="${artObject.art_photo_url}" alt="${artObject.name}" class="art-photo">
                    <p>${artObject.name}</p>
                    <p>by ${artObject.artist}</p>
                `;
                artDiv.addEventListener("click", () => showArtDetails(artObject));
                galleryElement.appendChild(artDiv);
                displayedIndices.add(index);
            });
        }

        function showArtDetails(artObject) {
            artDetails.innerHTML = `
                <div class="art-details-content">
                    <h3>${artObject.name}</h3>
                    <img src="${artObject.artist_photo_url}" alt="${artObject.artist}" class="artist-photo">
                    <p><strong>Artist:</strong> ${artObject.artist}</p>
                    <p><strong>Year:</strong> ${artObject.year}</p>
                    <p><strong>Century:</strong> ${artObject.century}</p>
                    <p><strong>Description:</strong> ${artObject.short_description}</p>
                    <img src="${artObject.art_photo_url}" alt="${artObject.name}" class="art-photo">
                    <button id="closeDetailsBtn">Close</button>
                </div>
            `;
            artDetails.style.display = "block";
            document.getElementById("closeDetailsBtn").addEventListener("click", () => {
                artDetails.style.display = "none";
            });
        }

        loadMoreBtn.addEventListener("click", function () {
            let startIndex = (currentPage - 1) * itemsPerPage;
            let endIndex = startIndex + itemsPerPage;
            let remainingArtObjects = filteredArtData.filter((_, index) => !displayedIndices.has(index)).slice(startIndex, endIndex);

            displayArt(remainingArtObjects, true);

            currentPage++;

            if (endIndex >= filteredArtData.filter((_, index) => !displayedIndices.has(index)).length) {
                loadMoreBtn.style.display = "none";
            }
        });

        searchBtn.addEventListener("click", function () {
            const query = searchBar.value.toLowerCase();
            const criteria = searchCriteria.value;
            filteredArtData = artData.filter(artObject => artObject[criteria].toLowerCase().includes(query));
            currentPage = 1;
            displayedIndices.clear();
            displayArt(filteredArtData.slice(0, itemsPerPage));
            loadMoreBtn.style.display = filteredArtData.length > itemsPerPage ? "block" : "none";
        });

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                artData = data;
                filteredArtData = artData;
                loadMoreBtn.click();
            })
            .catch(error => {
                console.error('Error fetching art data:', error);
            });
    }
    else if (page == "createaccount") {
        rootElement.innerHTML = `
        <h2>Create Account</h2>
        <form id="newUserForm">
            <label>Name:</label>
            <input type="text" id="name" required><br>
            <label>Surname:</label>
            <input type="text" id="surname" required><br>
            <label>Username:</label>
            <input type="text" id="username" required><br>
            <label>Email:</label>
            <input type="email" id="email" required><br>
            <label>Password:</label>
            <input type="password" id="password" required><br>
            <button type="submit">Create User</button>
        </form>
        <div id="message"></div>
        `;

        const form = document.getElementById("newUserForm")
        form.addEventListener("submit", function (event) {
            event.preventDefault()
            const message = document.getElementById("message")
            message.innerHTML = ""
            userNames.forEach(userName => {
                if (form.elements.username.value === userName) {
                    message.innerHTML = "This username already exists!"
                }
            })
            emails.forEach(email => {
                if (form.elements.email.value === email) {
                    message.innerHTML = "This email already exists!"
                }
            })
            const password = form.elements.password.value
            if (password.length < 6) {
                message.innerHTML = "Password must be at least 6 characters!"
            } else if (!/[a-z]/.test(password)) {
                message.innerHTML = "Password must contain at least one lowercase letter!";
            } else if (!/[A-Z]/.test(password)) {
                message.innerHTML = "Password must contain at least one uppercase letter!";
            } else if (!/\d/.test(password)) {
                message.innerHTML = "Password must contain at least one number!";
            }
            if (message.innerHTML === "") {
                const formData = {
                    id: [],
                    name: form.elements.name.value,
                    surname: form.elements.surname.value,
                    username: form.elements.username.value,
                    email: form.elements.email.value,
                    password: form.elements.password.value
                }
                fetch('/createaccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        // Redirect to home page after successful account creation
                        window.location.href = '/home';
                    })
                    .catch(error => {
                        console.error('Error:', error)
                    })
            }
        })
    }

    else if (page == "login") {
        rootElement.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <label>Username:</label>
            <input type="text" id="loginUsername" required><br>
            <label>Password:</label>
            <input type="password" id="loginPassword" required><br>
            <button type="submit">Login</button>
        </form>
        <div id="loginMessage"></div>
        `;
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const loginMessage = document.getElementById("loginMessage");
            loginMessage.innerHTML = "";
            const formData = {
                username: loginForm.elements.loginUsername.value,
                password: loginForm.elements.loginPassword.value
            };
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
                .then
                (response => response.json())
                .then(data => {
                    if (data.token) {
                        console.log('Login successful, token:', data.token);
                        localStorage.setItem('token', data.token);
                        window.location.href = '/home';  // Redirect to events page for testing
                    } else {
                        loginMessage.innerHTML = "Invalid username or password";
                    }                                                
                })
                .catch(error => {
                    console.error('Error:', error);
                    loginMessage.innerHTML = "Invalid username or password";
                });
        });
    }

    else if(page == 'payment'){
        rootElement.innerHTML = `
        <div class="body-payment">
        <div class="payment-title">
        <h1>Payment Information</h1>
    </div>
    <div class="container preload">
        <div class="creditcard">
            <div class="front">
                <div id="ccsingle"></div>
                <svg version="1.1" id="cardfront" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px" y="0px" viewBox="0 0 750 471" style="enable-background:new 0 0 750 471;" xml:space="preserve">
                    <g id="Front">
                        <g id="CardBackground">
                            <g id="Page-1_1_">
                                <g id="amex_1_">
                                    <path id="Rectangle-1_1_" class="lightcolor grey" d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                            C0,17.9,17.9,0,40,0z" />
                                </g>
                            </g>
                            <path class="darkcolor greydark" d="M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z" />
                        </g>
                        <text transform="matrix(1 0 0 1 60.106 295.0121)" id="svgnumber" class="st2 st3 st4">0123 4567 8910 1112</text>
                        <text transform="matrix(1 0 0 1 54.1064 428.1723)" id="svgname" class="st2 st5 st6">JOHN DOE</text>
                        <text transform="matrix(1 0 0 1 54.1074 389.8793)" class="st7 st5 st8">cardholder name</text>
                        <text transform="matrix(1 0 0 1 479.7754 388.8793)" class="st7 st5 st8">expiration</text>
                        <text transform="matrix(1 0 0 1 65.1054 241.5)" class="st7 st5 st8">card number</text>
                        <g>
                            <text transform="matrix(1 0 0 1 574.4219 433.8095)" id="svgexpire" class="st2 st5 st9">01/23</text>
                            <text transform="matrix(1 0 0 1 479.3848 417.0097)" class="st2 st10 st11">VALID</text>
                            <text transform="matrix(1 0 0 1 479.3848 435.6762)" class="st2 st10 st11">THRU</text>
                            <polygon class="st2" points="554.5,421 540.4,414.2 540.4,427.9 		" />
                        </g>
                        <g id="cchip">
                            <g>
                                <path class="st2" d="M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3
                        c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z" />
                            </g>
                            <g>
                                <g>
                                    <rect x="82" y="70" class="st12" width="1.5" height="60" />
                                </g>
                                <g>
                                    <rect x="167.4" y="70" class="st12" width="1.5" height="60" />
                                </g>
                                <g>
                                    <path class="st12" d="M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3
                            c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3
                            C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5
                            c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5
                            c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z" />
                                </g>
                                <g>
                                    <rect x="82.8" y="82.1" class="st12" width="25.8" height="1.5" />
                                </g>
                                <g>
                                    <rect x="82.8" y="117.9" class="st12" width="26.1" height="1.5" />
                                </g>
                                <g>
                                    <rect x="142.4" y="82.1" class="st12" width="25.8" height="1.5" />
                                </g>
                                <g>
                                    <rect x="142" y="117.9" class="st12" width="26.2" height="1.5" />
                                </g>
                            </g>
                        </g>
                    </g>
                    <g id="Back">
                    </g>
                </svg>
            </div>
            <div class="back">
                <svg version="1.1" id="cardback" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px" y="0px" viewBox="0 0 750 471" style="enable-background:new 0 0 750 471;" xml:space="preserve">
                    <g id="Front">
                        <line class="st0" x1="35.3" y1="10.4" x2="36.7" y2="11" />
                    </g>
                    <g id="Back">
                        <g id="Page-1_2_">
                            <g id="amex_2_">
                                <path id="Rectangle-1_2_" class="darkcolor greydark" d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                        C0,17.9,17.9,0,40,0z" />
                            </g>
                        </g>
                        <rect y="61.6" class="st2" width="750" height="78" />
                        <g>
                            <path class="st3" d="M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5
                    C707.1,246.4,704.4,249.1,701.1,249.1z" />
                            <rect x="42.9" y="198.6" class="st4" width="664.1" height="10.5" />
                            <rect x="42.9" y="224.5" class="st4" width="664.1" height="10.5" />
                            <path class="st5" d="M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z" />
                        </g>
                        <text transform="matrix(1 0 0 1 621.999 227.2734)" id="svgsecurity" class="st6 st7">985</text>
                        <g class="st8">
                            <text transform="matrix(1 0 0 1 518.083 280.0879)" class="st9 st6 st10">security code</text>
                        </g>
                        <rect x="58.1" y="378.6" class="st11" width="375.5" height="13.5" />
                        <rect x="58.1" y="405.6" class="st11" width="421.7" height="13.5" />
                        <text transform="matrix(1 0 0 1 59.5073 228.6099)" id="svgnameback" class="st12 st13">John Doe</text>
                    </g>
                </svg>
            </div>
        </div>
    </div>
    <div class="form-container">
        <div class="field-container">
            <label for="name">Name</label>
            <input id="name" maxlength="20" type="text">
        </div>
        <div class="field-container">
            <label for="cardnumber">Card Number</label><span id="generatecard">generate random</span>
            <input id="cardnumber" type="text" pattern="[0-9]*" inputmode="numeric">
            <svg id="ccicon" class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">

            </svg>
        </div>
        <div class="field-container">
            <label for="expirationdate">Expiration (mm/yy)</label>
            <input id="expirationdate" type="text" pattern="[0-9]*" inputmode="numeric">
        </div>
        <div class="field-container">
            <label for="securitycode">Security Code</label>
            <input id="securitycode" type="text" pattern="[0-9]*" inputmode="numeric">
        </div>
    </div>
    </div>
        `;       
    }

});
