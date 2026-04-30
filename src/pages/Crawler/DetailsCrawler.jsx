import React, { useState, useEffect, useMemo } from "react";
import { InputSearch, SortingTable, Button, Breadcrumb } from "@a12e/accessmonitor-ds";
import { Link, useParams } from "react-router";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useTranslation } from "react-i18next";
import { Modal } from "../../components/Modal.jsx";
import { directoriesHeadersCrawlDetails, columnsOptionsCrawlDetails, nameOfIcons } from "./table.config.jsx";
import { api } from "../../config/api";
import moment from "moment";
export default function DetailsCrawler() {
  const { t } = useTranslation();
  const { id, websiteId } = useParams();
  const [website, setWebsite] = useState({
    Name: "",
    StartingUrl: "",
    numberOfPages: 0,
  });
  const breadcrumbs = [
    { children: <Link to="/dashboard/home">Início</Link> },
    { children: <Link to="/dashboard/crawler">Crawlers</Link> },
    { title: "Importação de páginas para o sítio Web" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/crawler/getByCrawlWebsiteID/${id}`);
      const responseWebsite = await api.get(`/website/info/${websiteId}`);
      setWebsite(responseWebsite.data.result);
      setPageNumber(response.data.result.length);
      setData(
        response.data.result.map((crawl, index) => ({
          id: index,
          Uri: crawl.Uri,
        }))
      );
    };
    fetchData();
  }, []);
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [checkboxesSelected, setCheckboxesSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter((item) =>
      item.Uri.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleImport = async () => {
    const selectedItems = checkboxesSelected;
    const response = await api.post(`page/add`, {
      observatory: JSON.stringify(selectedItems.map((item) => item.Uri)),
      uris: JSON.stringify(selectedItems.map((item) => item.Uri)),
      websiteId: websiteId,
    });

    if (response.status === 200 || response.status === 201) {
      setOpenModal(true);
      setCheckboxesSelected([]);
      setFeedbackMessage(
        "As páginas irão ser avaliadas em segundo plano, e a sua informação estará disponível assim que possível."
      );
    } else {
      setFeedbackMessage("Erro inesperado ao importar");
    }
  };

  return (
    <div>
      <Breadcrumb data={breadcrumbs} />
      <h1>Importação de páginas para o sítio Web</h1>
      <div className="content bg-white">
        <p>Está a atuar sobre o sítio web:</p>
        <ul>
          <li>Sítio Web: {website.Name}</li>
          <li>URL inicial: {website.StartingUrl}</li>
          <li>
            Nº de Páginas na amostra: {pageNumber}({website.Pages})
          </li>
        </ul>
        <p>
          O robô encontrou a lista de páginas abaixo. Selecione as páginas que
          pretende importar.
        </p>
        <p>
          Nota: o processo de importação só vai importar os URLs que ainda não
          existem na amostra.
        </p>
        <div className="d-flex gap-2 align-items-center mb-3">
          <span>{t("MISC.filter")}</span>
          <InputSearch
            darkTheme={theme}
            placeholder={t("MISC.filter") + "..."}
            label={t("MISC.filter")}
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex gap-4 justify-content-start mb-4">
          <Button
            darkTheme={theme}
            text={"Importar"}
            className="btn-primary"
            onClick={handleImport}
            disabled={checkboxesSelected.length === 0}
          />
        </div>

        <SortingTable
          darkTheme={theme}
          headers={directoriesHeadersCrawlDetails}
          setDataList={setData}
          dataList={filteredData}
          columnsOptions={columnsOptionsCrawlDetails}
          nextPage={() => null}
          caption="Listagem de páginas encontradas"
          iconsAltTexts={nameOfIcons}
          project={""}
          setCheckboxesSelected={setCheckboxesSelected}
          checkedItems={checkboxesSelected}
          pagination={true}
          serverSidePagination={false}
          totalItems={filteredData.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(items) => { setItemsPerPage(items); setCurrentPage(1); }}
          paginationButtonsTexts={[
            "Primeira página",
            "Página anterior",
            "Página seguinte",
            "Última página"
          ]}
          nItemsPerPageTexts={[
            "Ver",
            "por página",
            "Selector de itens por página",
            "Navegação do seletor de itens por página"
          ]}
          itemsPaginationTexts={[
            " de ",
            " itens "
          ]}
          rowKey="id"
        />
      </div>
      <Modal
        title="Importação"
        onClose={() => setFeedbackMessage("")}
        isOpen={openModal}
      >
        <p>{feedbackMessage}</p>
        <Button
          darkTheme={theme}
          text={"Fechar"}
          className="btn-primary"
          onClick={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  );
}
