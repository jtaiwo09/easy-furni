"use client";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { faqs } from "@/utils/data";
import React, { useState } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails, {
  AccordionDetailsProps,
} from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { MdAdd, MdRemove } from "react-icons/md";
import { styled } from "@mui/material/styles";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `1px solid rgba(215,215,215,1)`,
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  backgroundColor: "#fff",
}));

const AccordionDetails = styled((props: AccordionDetailsProps) => (
  <MuiAccordionDetails {...props} />
))(() => ({
  padding: "20px 15px",
  borderTop: "1px solid rgba(215,215,215,1)",
}));

function page() {
  const [expanded, setExpanded] = useState<string | false>("tab1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4]">
      <CustomBreadCrumb />
      <div className="container px-4 mb-10">
        <h2 className="text-center mb-5 text-[1.5rem] sm:text-[2.25rem] font-semibold">
          Frequently Asked Questions
        </h2>
        <div>
          {faqs &&
            faqs.map((item) => (
              <Accordion
                expanded={expanded === item.index}
                onChange={handleChange(item.index)}
                className="mb-2"
              >
                <AccordionSummary
                  expandIcon={
                    expanded === item.index ? (
                      <MdRemove className="text-2xl" />
                    ) : (
                      <MdAdd className="text-2xl" />
                    )
                  }
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className="!text-base !font-semibold">
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
      </div>
    </div>
  );
}

export default page;
