package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.OfferRequest;
import com.lbrce.canteen.dto.OfferResponse;
import com.lbrce.canteen.entity.Offer;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.OfferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class OfferService {

    private final OfferRepository offerRepository;
    private final DtoMapper mapper;

    public OfferService(OfferRepository offerRepository, DtoMapper mapper) {
        this.offerRepository = offerRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> active() {
        return offerRepository.findActive(Instant.now())
                .stream().map(mapper::toOffer).toList();
    }

    @Transactional
    public OfferResponse create(OfferRequest req) {
        Offer o = new Offer();
        o.setTitle(req.title());
        o.setDescription(req.description());
        o.setDiscountPercent(req.discountPercent());
        o.setActive(req.active() == null ? Boolean.TRUE : req.active());
        o.setValidFrom(req.validFrom());
        o.setValidTo(req.validTo());
        return mapper.toOffer(offerRepository.save(o));
    }

    @Transactional
    public OfferResponse update(Long id, OfferRequest req) {
        Offer o = offerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Offer not found: " + id));
        o.setTitle(req.title());
        o.setDescription(req.description());
        o.setDiscountPercent(req.discountPercent());
        if (req.active() != null) o.setActive(req.active());
        o.setValidFrom(req.validFrom());
        o.setValidTo(req.validTo());
        return mapper.toOffer(o);
    }

    @Transactional
    public void delete(Long id) {
        if (!offerRepository.existsById(id)) throw new NotFoundException("Offer not found: " + id);
        offerRepository.deleteById(id);
    }
}