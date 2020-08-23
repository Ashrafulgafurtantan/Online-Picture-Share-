import React, { useEffect } from "react";
import { FaCode } from "react-icons/fa";
import Axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import CheckBox from "./Sections/CheckBox";

import ImageSlider from "../../utils/ImageSlider";
import { Collapse } from "antd";
const { Panel } = Collapse;

const { Meta } = Card;

const continents = [
  { key: 0, value: "Africa" },
  { key: 1, value: "Asia" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Australia" },
  { key: 4, value: "Antertica" },
  { key: 5, value: "North America" },
  { key: 6, value: "South America" },
];

function LandingPage() {
  const [Products, setProducts] = React.useState([]);
  const [showLoadButton, setShowLoadButton] = React.useState(true);
  const [Checked, setChecked] = React.useState([1, 1, 1, 1, 1, 1, 1]);
  const [filters, setFilters] = React.useState({
    continent: [],
    price: [],
  });
  const [load, setLoad] = React.useState({ skip: 0, limit: 8 });
  useEffect(() => {
    const variables = {
      skip: load.skip,
      limit: load.limit,
    };
    getProducts(variables);
  }, [setChecked]);

  const getProducts = (variables) => {
    Axios.post("/api/product/getProducts", variables).then((response) => {
      if (response.data.success) {
        const data = response.data.products;

        if (variables.LoadMore) {
          setProducts([...Products, ...data]);
        } else {
          setProducts(data);
        }
        response.data.postSize >= load.limit
          ? setShowLoadButton(true)
          : setShowLoadButton(false);
      } else {
        alert("Failed to fetch data");
      }
    });
  };

  function showFiltersResult(continents) {
    console.log(continents);
    // setFilters((prevVal) => {
    //   return { ...prevVal, continents: continents };
    // });
    const variables = {
      skip: 0,
      limit: load.limit,
      filters: filters,
    };

    getProducts(variables);
    setLoad((prevVal) => {
      return {
        skip: 0,
        limit: 8,
      };
    });
  }

  function handleClick(id) {
    console.log(id);
    var temp = Checked;
    temp[id] = temp[id] == 1 ? 0 : 1;
    const continents = [];
    temp.forEach((val, index) => {
      if (val == 0) continents.push(index);
    });
    setFilters({ continent: continents });

    showFiltersResult(continents);
    setChecked(temp);
  }

  const onLoadMore = () => {
    var add = load.skip + load.limit;

    const variables = {
      skip: add,
      limit: load.limit,
      LoadMore: true,
    };
    getProducts(variables);

    setLoad((prevVal) => {
      return {
        skip: add,
        limit: 8,
      };
    });
  };
  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={12} key={index}>
        <Card hoverable={true} cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          {" "}
          Let's Travel Anywhere <Icon type="rocket" />{" "}
        </h2>
      </div>

      {/* Filter  */}
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Continents" key="1">
          {continents.map((val, index) => {
            return (
              <CheckBox
                handleClick={handleClick}
                val={val.value}
                key={index}
                extraVal={val.key}
              />
            );
          })}
        </Panel>
      </Collapse>

      {/* <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <CheckBox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row> */}

      {/* Search  */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerms} />
      </div> */}

      {Products.length === 0 ? (
        <div
          style={{
            display: "flex",
            height: "300px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>No post yet...</h2>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>{renderCards}</Row>
        </div>
      )}
      <br />
      <br />

      {showLoadButton && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
