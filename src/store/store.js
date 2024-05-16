export const getState = ({ getActions, getStore, setStore }) => {
    return {
        store: {
            user: {
                username: "",
                firstname: "",
                lastname: "",
                password: "",
                email: ""
            },
            accessToken: "",
            usersList: [],
            productForm: {
                name: "",
                price: 0,
                photo: "",
                product_info: "",
                brand: ""
            },
            userProducts: [{
                name: "zapatilla",
                price: 25000,
                photo: "",
                product_info: "buenas zapatillas",
                brand: "nike"
            },{
                name: "televisor",
                price: 100000,
                photo: "https://www.semana.com/resizer/UZ2pD8YgPJcQS2B9nGsZEH1pqeY=/fit-in/1280x0/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/4GDPNFO3X5HKZC6KCFPXBWKTBQ.jpg",
                product_info: "tele vieja",
                brand: "LG"
            }],
            publishedProducts: [],
            categoryProducts:[],
            loginValidation: false,
            registerValidation: false,
            contacto: {
                destinatario: '',
                mensaje: '',
            },
            UserProductOfferList: [
                {
                    name: "zapatilla",
                    price: 25000,
                    product_info: "buenas zapatillas",
                    brand: "nike"
                },
                {
                    name: "zapatillaNike",
                    price: 25,
                    product_info: "buenas zapatillas",
                    brand: "nike"
                },
                {
                    name: "zapatillaJordan23",
                    price: 250002,
                    product_info: "buenas zapatillas",
                    brand: "nike"
                },
                {
                    name: "zapatillaPailitaSutro",
                    price: 250003,
                    product_info: "buenas zapatillas",
                    brand: "nike"
                }
            ],
            
            UserProductForPermuta: [
                {
                    photo: "https://www.semana.com/resizer/UZ2pD8YgPJcQS2B9nGsZEH1pqeY=/fit-in/1280x0/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/4GDPNFO3X5HKZC6KCFPXBWKTBQ.jpg",
                    name: "Guitarra de michel jackson",
                    price: 25000,
                    product_info: "buena guitarra",
                    brand: "EEUU",

                },
              
            ],
            
        },


        actions: {
            handleOnchange: (event) => {
                const store = getStore();
                setStore({
                    user: {
                        ...store.user,
                        [event.target.name]: event.target.value
                    }
                });
            },

            handleProductOnChange: (event) => {
                const store = getStore();
                setStore({
                    productForm: {
                        ...store.productForm,
                        [event.target.name]: event.target.value
                    }
                });
            },

            handleSubmitLogin: async (e) => {
                const store = getStore();
                let validation = store.loginValidation;
                await fetch("http://localhost:5000/user/login", {
                    method: "POST",
                    body: JSON.stringify(store.user),
                    headers: {
                        "content-type": "application/json"
                    }
                }).then((response) => {
                    if (response.status !== 200) {
                        throw new Error(response.json());
                    }
                    return response.json();
                })
                .then((data) => {
                    localStorage.setItem("accessToken", data.access_token);
                    validation = true;
                })
                .catch((error) => console.log(error));
                return validation;
            },

            logout: () => {
                localStorage.removeItem("accessToken");
                console.log("logout");
            },

            handleSubmituser: async () => {
                const store = getStore();
                let validation = store.registerValidation;

                await fetch("http://localhost:5000/user/register", {
                    method: "POST",
                    body: JSON.stringify(store.user),
                    headers: {
                        "content-type": "application/json"
                    }
                })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .then(validation = true)
                .catch((error) => console.log(error));

                return validation;
            },

            handleSubmitGoogleuser: async (user) => {
                const store = getStore();
                let validation = store.loginValidation;
                await fetch("http://localhost:5000/user/logingoogle", {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers: {
                        "content-type": "application/json"
                    }
                }).then((response) => response.json())
                .then((data) => {
                    localStorage.setItem("accessToken", data.access_token);
                    validation = true;
                })
                .catch((error) => console.log(error));
                return validation;
            },

            accessTokenExpired: () => {
                let accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                    fetch("http://localhost:5000/users", {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                            Authorization: "Bearer " + accessToken
                        }
                    }).then((response) => response.json())
                    .then((data) => { data.msg === "Token has expired" ? localStorage.removeItem("accessToken") : console.log("accessTokenValid") })
                    .catch((error) => console.log(error));
                } else {
                    console.log("need auth token");
                }
            },

            fetchPublishedProducts: () => {
                const store = getStore();
                fetch("http://localhost:5000/products/published", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then((response) => response.json())
                .then((data) => setStore({
                    publishedProducts: data
                }))
                .catch((error) => console.log(error));
            },

            handleProductUpload: (event) => {
                console.log("Manejador de envío de producto ejecutándose...");
                const store = getStore();
                event.preventDefault();

                console.log("Datos del formulario:", store.productForm);

                fetch("http://localhost:5000/products/upload", {
                    method: "POST",
                    body: JSON.stringify({
                        ...store.productForm
                    }),
                    headers: {
                        "Content-Type": "application/json"

                    }
                })
                .then((response) => response.json())
                .then((data) => {
                    setStore({
                        accessToken: data.access_token
                    });
                    console.log("Respuesta del servidor:", data);
                    console.log(data);
                })
                .catch((error) => console.log(error));
            },

            fetchUserProducts: () => {
                const store = getStore();
                fetch("http://localhost:5000/products/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + store.accessToken
                    }
                })
                .then((response) => response.json())
                .then((data) => setStore({
                    userProducts: data
                }))
                .catch((error) => console.log(error));
            },

            handleContactoChange: (event) => {
                const store = getStore();
                setStore({
                    contacto: {
                        ...store.contacto,
                        [event.target.name]: event.target.value,
                    },
                });
            },

            enviarMensaje: () => {
                const store = getStore();
                console.log('Mensaje enviado:', store.contacto.mensaje);
                setStore({
                    contacto: {
                        ...store.contacto,
                        mensaje: '',
                    },
                });
            },
        },
    };
};
