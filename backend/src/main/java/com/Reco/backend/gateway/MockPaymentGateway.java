package com.Reco.backend.gateway;

import com.Reco.backend.model.PaymentMethod;
import com.Reco.backend.model.PaymentStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class MockPaymentGateway {

    public PaymentStatus process(BigDecimal amount, PaymentMethod paymentMethod, String paymentMethodDetails) {
        if (amount == null || amount.signum() <= 0) {
            return PaymentStatus.FAILED;
        }

        if (paymentMethod == PaymentMethod.MOCK_GATEWAY) {
            return PaymentStatus.SUCCESS;
        }

        if (paymentMethodDetails != null
                && paymentMethodDetails.replaceAll("\\s", "").endsWith("0000")) {
            return PaymentStatus.FAILED;
        }

        return PaymentStatus.SUCCESS;
    }
}
