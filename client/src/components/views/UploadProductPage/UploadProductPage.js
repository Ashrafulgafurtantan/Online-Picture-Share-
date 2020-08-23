import React from "react";
import { Button } from "react-bootstrap";
import FileUpload from "../../utils/FileUpload";
import axios from "axios";
function UploadProductPage(props) {
  const continents = [
    { key: 0, value: "Africa" },
    { key: 1, value: "Asia" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Australia" },
    { key: 4, value: "Antertica" },
    { key: 5, value: "North America" },
    { key: 6, value: "South America" },
  ];

  const [details, setDetails] = React.useState({
    title: "",
    description: "",
    price: 0,
    continent: 0,
  });
  const [images, setImages] = React.useState([]);
  function handleChange(event) {
    const { name, value } = event.target;
    console.log(name + " = " + value);
    setDetails((prevVal) => {
      return { ...prevVal, [name]: value };
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    // if (
    //   !details.title ||
    //   !details.description ||
    //   !details.price ||
    //   details.continent ||
    //   !images
    // ) {
    //   return alert("Fill all the Field");
    // }
    const variables = {
      writer: props.user.userData._id,
      title: details.title,
      description: details.description,
      price: details.price,
      continent: details.continent,
      images: images,
    };
    axios.post("/api/product/uploadProduct", variables).then((response) => {
      if (response.data.success) {
        alert("product successfully uploaded");
        props.history.push("/");
      } else {
        alert("product uploade failure");
      }
    });

    console.log(details);
  }

  function updateImages(newImage) {
    setImages(newImage);
  }
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>Upload Travel Products</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* DropZone */}
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <div className="form-group">
          <label>Title: </label>
          <input
            type="text"
            required
            name="title"
            className="form-control"
            value={details.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description: </label>
          <textarea
            type="text"
            required
            name="description"
            className="form-control"
            value={details.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Price($)</label>{" "}
          <input
            type="number"
            name="price"
            required
            className="form-control"
            value={details.price}
            onChange={handleChange}
          />
        </div>
        <br />
        <select
          required
          className="form-control"
          name="continent"
          defaultValue={continents[0].key}
          onChange={handleChange}
        >
          {continents.map((continent) => {
            return (
              <option key={continent.key} value={continent.key}>
                {continent.value}
              </option>
            );
          })}
        </select>
        <br />

        <div className="form-group">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ minWidth: "10%" }}
            onSubmit={handleSubmit}
          >
            Upload
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UploadProductPage;
