import { useEffect, useState } from "react";
import NetworkChart from "./NetworkChart";
import RawData from "./book1.json";
import "./App.css";

function createLinks(nodes, raw) {
  let lines = [];

  raw.forEach((element) => {
    let source = element.Source;
    let target = element.Target;

    let sourceElement = nodes.find((element) => element.name === source);
    let targetElement = nodes.find((element) => element.name === target);

    lines.push({
      source: sourceElement.id,
      target: targetElement.id,
      weight: element.weight,
    });
  });

  return lines;
}

function createNodes(raw) {
  let characters = [];
  let nodes = [];
  let count = 0;

  raw.forEach((element, index) => {
    let source = element.Source;
    let target = element.Target;

    if (!characters.includes(source)) {
      characters.push(source);
      nodes.push({ id: count, name: source });
      count += 1;
    }

    if (!characters.includes(target)) {
      characters.push(target);
      nodes.push({ id: count, name: target });
      count += 1;
    }
  });

  return nodes;
}

function mergeData(nodes, links) {
  let data = { nodes: nodes, links: links };
  return data;
}

function App() {
  useEffect(() => {
    let raw = RawData;
    let nodes = createNodes(raw);
    let links = createLinks(nodes, raw);

    let finalData = mergeData(nodes, links);

    setData(finalData);

    setIsLoaded(true);
  }, []);

  const [data, setData] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  return isLoaded && <NetworkChart data={data} />;
}

export default App;
